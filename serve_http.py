from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl
import sys


class NoCacheHTTPRequestHandler(SimpleHTTPRequestHandler):
    def send_response_only(self, code, message=None):
        super().send_response_only(code, message)
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')


if __name__ == '__main__':
    # Minimal example of serving the directory contents via HTTPS
    httpd = HTTPServer(('0.0.0.0', 8888), NoCacheHTTPRequestHandler)
    print(f'Serving directory on http://0.0.0.0:8888 (caching is disabled, plain HTTP, you need to use ngrok or similar tool for SSL)')
    httpd.serve_forever()
