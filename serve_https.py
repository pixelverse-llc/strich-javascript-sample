from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl
import sys

if __name__ == '__main__':

    if len(sys.argv) < 2:
        print('Usage: serve_https.py PATH_TO_KEY PATH_TO_CERT')
        sys.exit(1)

    # Minimal example of serving the directory contents via HTTPS
    httpd = HTTPServer(('0.0.0.0', 4443), SimpleHTTPRequestHandler)
    httpd.socket = ssl.wrap_socket(httpd.socket, keyfile=sys.argv[1], certfile=sys.argv[2], server_side=True)
    print('Serving directory on https://0.0.0.0:4443')
    httpd.serve_forever()
