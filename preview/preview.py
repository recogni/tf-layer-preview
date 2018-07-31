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

    def inject_pydef_time_data(self, op_preview, name, *tf_tensors):
        """ Inject definition time data from the tensor list specified in
            `tf_tensors`.
        """
        op_preview.name = name
        op_preview.data = "Tensor preview for %s" % (name)
        for t in tf_tensors:
            tp = proto.OpTensor()
            tp.name = t.name
            tp.type = str(t.dtype)
            s = t._shape_as_list()
            if s:
                tp.shape.extend(s)
            r = t._rank()
            if r:
                tp.rank = r
            op_preview.tensors.extend([tp])
        return op_preview

    def inject_graph_time_data(self, op_preview, name, *np_tensors):
        """ Given a name and a list of numpy tensors, build a `preview` proto
            of the data for visualization by the front-end.

            The `op_preview` refers to the protobuf of the `OpPreview` proto.
            This is input so that we can preserve the definition-time data
            known before graph execution time.
        """
        # TODO: Handle single batch types
        # TODO: Data per tensor batch into OpTensor
        # TODO: for t in np_tensors:
            # TODO: Inject tensor value here.
        return op_preview

    def get_preview_func(self, name, *tf_tensors):
        """ Wrapper for the py_func so that we have the ability to pass
            custom arguments like the layer name etc above.

            NOTE: The `*tf_tensors` passed above are __DIFFERENT__ than the
                  ones passed into the py_func below.  The former refers to
                  the actual tensorflow tensors defined at graph definition
                  time, while the latter refers to the converted numpy tensors
                  which show up at graph execution time.
        """

        # Build a preview packet for each set of ops that need to be analyzed.
        # This is filled out with any tensorflow specific tensor data that
        # will be unknown at py_func exec time. By defining the `pp` variable
        # outside the py_func, it can be re-used each time `this` layer / op
        # is analyzed.
        #
        # NOTE: Is it currently ok to update the graph_time_data without
        #       clearing the protobuf since the data is orthogonal.
        pp = proto.OpPreview()
        pp = self.inject_pydef_time_data(name, *tf_tensors)

        def py_func(*np_tensors):
            """ PyFunc that executes at graph time and halts the graph so that
                we can halt the graph and inspect variables.  The `*args` here
                is the list of tensor inputs which are typically passed to a
                py_func (list of tensors), since we do not know how many might
                be passed into the func, we use a variadic argument above.
            """

            # TODO: Returning pp from each of the injects might not be needed.
            global app_packet
            app_packet.Clear()
            pp = self.inject_graph_time_data(name, pp, *np_tensors)
            app_packet.preview.CopyFrom(pp)

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

    def profile_ops(self, *tf_tensors, **kwargs):
        """ External API for the preview server.

            `*tf_tensors` is a list of tensor flow ops which will be analyzed
            when the `py_func` above halts the tf graph (at run-time).

            Possible (optional) named arguments include:
            `name` - Name of the layer, the default value is the op_count.

            This method returns a `tf.py_func` whose output mirrors the input
            tensors to this function making it sort of a
            inspect-and-pass-through method.
        """
        name   = kwargs.get("name", self.new_layer_name())
        dtypes = [op.dtype for op in tf_tensors]
        py_fn  = self.get_preview_func(name, *tf_tensors)
        return tf.py_func(py_fn, tf_tensors, dtypes)
