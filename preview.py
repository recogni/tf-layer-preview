#!/usr/bin/env python

import tensorflow as tf

import tornado
import tornado.web
import tornado.ioloop


def make_APIHandler(iol):
    class APIHandler(tornado.web.RequestHandler):
        def get(self):
            print "Issuing HTTP server halt ..."
            iol.stop()
    return APIHandler


class PreviewServer():
    def __init__(self, port=18899):
        self.host = ""
        self.port = port
        self.iol  = tornado.ioloop.IOLoop.instance()
        self.app  = tornado.web.Application([
            (r"/api", make_APIHandler(self.iol)),
            (r"/(.*)", tornado.web.StaticFileHandler, {
                "path": "./preview-app/build",
                "default_filename": "index.html",
            }),
        ])
        self.httpd = tornado.httpserver.HTTPServer(self.app)
        self.httpd.listen(self.port)

    def block_func(self, *args, **kwargs):
        print "block func called"
        print args
        for a in args:
            print a, type(a)

        self.iol.start()
        return args

    def op(self, *args, **kwargs):
        print "op called!"
        return tf.py_func(self.block_func, *args)
