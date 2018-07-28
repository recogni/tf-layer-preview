#!/usr/bin/env python

import tensorflow as tf
import webbrowser
import json

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

    def build_preview_message(self, *args, **kwargs):
        msg = ""
        for a in args:
            msg += "%s -- %s\n" % (str(a), type(a))
        return msg

    def preview_func(self, *args, **kwargs):
        global app_packet
        app_packet.Clear()
        app_packet.message = self.build_preview_message(*args, **kwargs)

        # If there are no sockets currently connected, fire one up!
        global app_sockets
        if app_sockets:
            for sock in app_sockets:
                sock.send_packet(app_packet)
        else:
            webbrowser.open("http://localhost:18899")

        self.op_count += 1
        self.iol.start()        # yield until server is happy
        return args

    def op(self, *args, **kwargs):
        return tf.py_func(self.preview_func, *args)
