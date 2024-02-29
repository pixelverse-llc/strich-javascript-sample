from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl
import sys


class NoCacheHTTPRequestHandler(SimpleHTTPRequestHandler):
    def send_response_only(self, code, message=None):
        super().send_response_only(code, message)
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')


if __name__ == '__main__':

    if len(sys.argv) < 2:
        print('Usage: serve_https.py PATH_TO_KEY PATH_TO_CERT')
        sys.exit(1)

    # Minimal example of serving the directory contents via HTTPS
    httpd = HTTPServer(('0.0.0.0', 4443), NoCacheHTTPRequestHandler)
    httpd.socket = ssl.wrap_socket(httpd.socket, keyfile=sys.argv[1], certfile=sys.argv[2], server_side=True)
    print('Serving directory on https://0.0.0.0:4443, caching is disabled')
    httpd.serve_forever()
