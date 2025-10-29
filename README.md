# STRICH SDK integration example using plain JavaScript/HTML/CSS

This repository shows how to use the STRICH SDK to create a barcode scanning application with just plain JavaScript (ES6), HTML and CSS, without using any framework or build tooling.

The app implements three basic scanning workflows that are popular in real-world use cases:

- Popup scanner: scans a single barcode using the built-in [PopupScanner](https://docs.strich.io/the-popup-scanner.html) integration.
- Single scan: scans a single barcode and returns the home screen
- Repeated scans: scans barcodes repeatedly, with a user interaction between scans
- Multiple scans: scans multiple barcodes until some condition is met

## Serving the Example App

The app still needs to be served from a [secure origin](https://docs.strich.io/deployment-guide.html). For development purposes, we've included a Python script `serve_https.py` to show how to use Python's built-in capabilities to quickly create a development server.

To create a self-signed certificate, check out any guide on the internet or this Stackoverflow answer: https://stackoverflow.com/a/41366949/1370154

Then run the script in this directory to serve the app over an HTTPS connecting using the self-signed certificate:

```shell
$ python3 serve_https.py tls_key.pem tls_cert.pem
```

Another popular option is to serve the application locally (by using `serve_http.py` for instance) and expose it via [ngrok](https://ngrok.com) or similar tools, with an automatically created TLS certificate and public DNS.
