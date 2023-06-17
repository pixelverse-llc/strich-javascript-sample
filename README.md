# STRICH SDK integration example using plain JavaScript/HTML/CSS

This repository shows how to use the STRICH SDK to create a barcode scanning
application with just plain JavaScript, HTML and CSS, without using any
framework or build tooling.

## Obtaining strich.js

Normally you obtain STRICH by installing from NPM. For this barebones example,
we are not using Node.js/NPM at all, so you can copy the file
`node_modules/@pixelverse/strichjs-sdk/dist/strich.js` from an NPM project
and store it in this directory.

## Serving from a secure origin

The app still needs to be served from a secure origin (HTTPS connection).
For development purposes, we've included a Python script `serve_https.py`
to show you can use Python's built-in capabilities to quickly create
a development server.

To create a self-signed certificate, check out any guide on the internet
or this Stackoverflow answer: https://stackoverflow.com/a/41366949/1370154

Then run the script in this directory to serve the app over an HTTPS
connecting using the self-signed certificate:

```shell
$ python3 serve_https.py tls_key.pem tls_cert.pem
```

Another popular option is to serve the application locally and expose it
via ngrok, with an automatically created TLS certificate and public DNS.
