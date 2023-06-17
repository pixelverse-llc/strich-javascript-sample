import {StrichSDK, BarcodeReader} from "./strich.js";

// the BarcodeReader configuration
let configuration = {
    selector: '#scanner',
    engine: {
        symbologies: [ 'ean13' ]
    },
    locator: {
        regionOfInterest: {
            left: 0.05, right: 0.05, top: 0.3, bottom: 0.3 // narrow RoE for 1D
        }
    },
    frameSource: {
        resolution: 'full-hd'
    },
    overlay: {
        showCameraSelector: true,
        showFlashlight: true,
        showDetections: false
    },
    feedback: {
        audio: true,
        vibration: true
    }
};


let barcodeReader = null;
let prompt = document.getElementById('prompt');
let hostElement = document.getElementById('scanner');
hostElement.style.display = 'none';

// hook up the button to start/stop scanning
let button = document.getElementById('start_stop_button');
button.disabled = true;
button.innerText = 'Start scanning';
button.onclick = () => {
    if (barcodeReader) {
        stopScanning(null);
    } else {
        startScanning()
            .then(() => {
                prompt.innerText = 'Scan an EAN-13 barcode';
                button.innerText = 'Stop scanning';
            })
            .catch((err) => {
                prompt.innerText = `Failed to start scanning: ` + err.message;
            });
    }
};

/**
 * Stop scanning, release BarcodeReader and camera, display scanned value.
 *
 * @param value The scanned value or null if the user cancelled.
 */
function stopScanning(value) {
    barcodeReader.stop();
    barcodeReader.destroy();
    barcodeReader = null;
    hostElement.style.display = 'none';
    if (value) {
        prompt.innerText = 'Scanned barcode: ' + value;
    } else {
        prompt.innerText = 'Stopped scanning before an item was scanned';
    }
    button.innerText = 'Start scanning';
}

/**
 * Initialize STRICH SDK, and if successful, proceed to initialize BarcodeReader.
 */
prompt.innerText = 'Initializing SDK...';
StrichSDK.initialize('<your license key>')
    .then(() => {
        prompt.innerText = 'SDK initialized successfully, ready to scan.';
        button.disabled = false;
    })
    .catch(err => {
        prompt.innerText = 'SDK initialization failed: ' + err.message;
    });

function startScanning() {

    // toggle host element
    hostElement.style.display = 'block';
    prompt.innerText = 'Initializing BarcodeReader...';

    // initialize BarcodeReader
    return new BarcodeReader(configuration).initialize()
        .then(br => {
            barcodeReader = br;
            br.detected = (detections) => {

                // stop scanning after an item was scanned
                stopScanning(detections[0].data);
            };
            return br.start();
        });
}
