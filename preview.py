import tensorflow as tf
import webbrowser

import tornado
import tornado.web
import tornado.websocket
import tornado.ioloop

from layer_preview_proto import preview_pb2 as proto

static_opts = {
    "path": "./preview-app/build",
    "default_filename": "index.html",
}

app_sockets = {}
app_packet  = proto.Packet(message="Loading ...")


def mk_NextOpHandler(iol):
    class NextOpHandler(tornado.web.RequestHandler):
        """ In order to issue the next op, halt the ioloop and return control
            to the PreviewServer's `preview_func` (where `ioloop.start()` was
            issued).
        """
        def get(self):
            iol.stop()
    return NextOpHandler


def mk_AppSocketHandler(iol):
    class AppSocketHandler(tornado.websocket.WebSocketHandler):
        """ This handler is responsible for feeding upstream messages to any
            and all connected sockets.  Use the `send_packet` method to send
            application specific protos to the front-end.
        """
        def open(self):
            global app_sockets
            app_sockets[self] = self
            self.send_packet(app_packet)

        def on_message(self, message):
            # TODO: All client messages should be protos.
            print "Got message: ", message

        def on_close(self):
            global app_sockets
            if self in app_sockets:
                del app_sockets[self]

        def send_packet(self, p=proto.Packet()):
            msg = p.SerializeToString()
            self.write_message(msg, binary=True)
    return AppSocketHandler


class PreviewServer():
    """ PreviewServer implements a HTTP server which serves a react front-end
        via a static handler, and implements a simple websocket / REST API for
        browser clients to interact with tensorflow layers.
    """
    def __init__(self, port=18899):
        self.host = ""
        self.port = port
        self.iol  = tornado.ioloop.IOLoop.instance()
        self.app  = tornado.web.Application([
            (r"/api/next_op",  mk_NextOpHandler(self.iol)),
            (r"/ws",           mk_AppSocketHandler(self.iol)),
            (r"/(.*)",         tornado.web.StaticFileHandler, static_opts),
        ])

        # Keep track of random interesting stats.
        self.op_count = 0

        # NOTE: Even though we are issuing a `listen` here, the server
        #       will not actually listen until the ioloop is started.
        self.httpd = tornado.httpserver.HTTPServer(self.app)
        self.httpd.listen(self.port)

    def new_layer_name(self):
        """ Returns a layer name for the current op being profiled.  This is
            used if one is not specified to the profile function.
        """
        return "layer-preview-%d" % (self.op_count)

    def build_preview(self, name, *tensors):
        """ Given a name and a list of tensors, build a `preview` proto of the
            data for visualization by the front-end.
        """
        msg = ""
        for t in tensors:
            msg += "%s -- %s\n" % (str(t), type(t))

        preview_proto = proto.OpPreview()
        preview_proto.name = name
        preview_proto.data = msg
        return preview_proto

    def get_preview_func(self, name):
        """ Wrapper for the py_func so that we have the ability to pass
            custom arguments like the layer name etc above.
        """
        def py_func(*tensors):
            """ PyFunc that executes at graph time and halts the graph so that
                we can halt the graph and inspect variables.  The `*args` here
                is the list of tensor inputs which are typically passed to a
                py_func (list of tensors), since we do not know how many might
                be passed into the func, we use a variadic argument above.
            """
            global app_packet
            app_packet.Clear()
            app_packet.preview.CopyFrom(self.build_preview(name, *tensors))

            # If there are no sockets currently connected, fire one up!
            global app_sockets
            if app_sockets:
                for sock in app_sockets:
                    sock.send_packet(app_packet)
            else:
                webbrowser.open("http://localhost:18899")

            self.iol.start()        # yield until server is happy
            self.op_count += 1      # increment the op count
            return tensors          # fall-through
        return py_func

    def profile_ops(self, *ops, **kwargs):
        """ External API for the preview server.

            `*ops` is a list of tensor flow ops which will be analyzed when
            the `py_func` above halts the tf graph (at run-time).

            Possible (optional) named arguments include:
            `name` - Name of the layer, the default value is the op_count.

            This method returns a `tf.py_func` whose output mirrors the input
            tensors to this function making it sort of a
            inspect-and-pass-through method.
        """
        name   = kwargs.get("name", self.new_layer_name())
        dtypes = [op.dtype for op in ops]
        return tf.py_func(self.get_preview_func(name), ops, dtypes)
