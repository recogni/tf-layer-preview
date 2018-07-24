#!/usr/bin/env python

import numpy
import webbrowser

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
