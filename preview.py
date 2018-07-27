#!/usr/bin/env python

import tensorflow as tf
import webbrowser
import json

import tornado
import tornado.web
import tornado.websocket
import tornado.ioloop

static_opts = {
    "path": "./preview-app/build",
    "default_filename": "index.html",
}

app_sockets = {}

last_message = "Nothing here yet ..."


def mk_APIHandler(iol):
    class APIHandler(tornado.web.RequestHandler):
        def get(self):
            print "Issuing HTTP server halt ..."
            iol.stop()
    return APIHandler


def mk_AppSocketHandler(iol):
    class AppSocketHandler(tornado.websocket.WebSocketHandler):
        def open(self):
            global app_sockets
            app_sockets[self] = self
            self.write_message(last_message)

        def on_message(self, message):
            print "Got message: ", message

        def on_close(self):
            global app_sockets
            if self in app_sockets:
                del app_sockets[self]
    return AppSocketHandler


class PreviewServer():
    def __init__(self, port=18899):
        self.host = ""
        self.port = port
        self.iol  = tornado.ioloop.IOLoop.instance()
        self.app  = tornado.web.Application([
            (r"/api",  mk_APIHandler(self.iol)),
            (r"/ws",   mk_AppSocketHandler(self.iol)),
            (r"/(.*)", tornado.web.StaticFileHandler, static_opts),
        ])

        # Keep track of random interesting stats.
        self.op_count = 0

        # NOTE: Even though we are issuing a `listen` here, the server
        #       will not actually listen until the ioloop is started.
        self.httpd = tornado.httpserver.HTTPServer(self.app)
        self.httpd.listen(self.port)

    def preview_func(self, *args, **kwargs):
        msg = ""
        for a in args:
            msg += "%s -- %s\n" % (str(a), type(a))

        global last_message
        last_message = msg

        # If there are no sockets currently connected, fire one up!
        global app_sockets
        if app_sockets:
            for sock in app_sockets:
                sock.write_message(last_message)
        else:
            webbrowser.open("http://localhost:18899")

        self.op_count += 1
        self.iol.start()        # yield until server is happy
        return args

    def op(self, *args, **kwargs):
        return tf.py_func(self.preview_func, *args)
