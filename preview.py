#!/usr/bin/env python

import numpy
import webbrowser
import tensorflow as tf

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

template_file = """
<html>
<head>
  <title>Tensorflow layer preview</title>
</head>
<body>
    <pre>%s</pre>
</body>
"""


def MkHandler(data):
    class Handler(BaseHTTPRequestHandler):
        def _handler(self):
            self.send_response(200)
            self.wfile.write("OK")
            self.wfile.close()

        def do_POST(self):
            self._handler()

        def do_GET(self):
            self.send_response(200)
            self.wfile.write(template_file % (data))
            self.wfile.close()
            self.server.handle_request()
    return Handler


def go_server_wait_post(data):
    s = HTTPServer(("", 18899), MkHandler(data))
    s.handle_request()


def op_preview(*args):
    summary = "TF Summary:\n\n"
    for arg in args:
        if type(arg) == numpy.ndarray:
            summary += "Array: [\n"
            for item in arg:
                summary += "  " + str(item) + "\n"
            summary += "]\n"
        else:
            summary += str(arg)
        summary += "\n"

    webbrowser.open("http://localhost:18899", new=0)
    go_server_wait_post(summary)

    return args


def generator():
    for i in range(1, 100, 1):
        yield "This is message %d" % (i), i


def main():
    o_types = (tf.string, tf.int64)
    dataset = tf.data.Dataset.from_generator(generator, output_types=o_types)

    # Define batch size
    dataset = dataset.batch(2)
    iter = dataset.make_one_shot_iterator()

    x, y = iter.get_next()
    x, y = tf.py_func(op_preview, [x, y], (tf.string, tf.int64))
    op   = tf.Print(x, [x, y], "X,Y=")

    # Run the session.
    with tf.Session() as sess:
        sess.run(op)
        sess.run(op)
        sess.run(op)


if __name__ == "__main__":
    main()
