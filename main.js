import {StrichSDK, BarcodeReader} from "https://cdn.jsdelivr.net/npm/@pixelverse/strichjs-sdk@1.3.4";

/**
 * Add detected code to DOM
 */
function addResult(codeDetection) {
    const resultElement = document.createElement('span');
    resultElement.innerHTML = codeDetection.data;
    document.getElementById('results').appendChild(resultElement);
}

/**
 * Initialize STRICH BarcodeReader and start scanning.
 */
function initializeBarcodeReader() {
    let configuration = {
        selector: '.scanner',
        engine: {
            // all 1D symbologies
            symbologies: [
                'databar', 'databar-exp', 'code128', 'code39', 'code93', 'i25', 'codabar',
                'ean13', 'ean8', 'upca', 'upce', 'i25'
            ],
            numScanlines: 15,
            minScanlinesNeeded: 2,
            duplicateInterval: 1500
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
    new BarcodeReader(configuration).initialize()
        .then(barcodeReader => {

            // store the BarcodeReader in a global, to be able to access it later (e.g. to destroy it)
            window['barcodeReader'] = barcodeReader;
            barcodeReader.detected = (detections) => {
                addResult(detections[0]);
            };
            barcodeReader.start().then(() => {
                console.log(`BarcodeReader.start() succeeded`);
            }).catch(err => {
                console.error(`BarcodeReader.start() failed: ${err}`);
            });
        })
        .catch(error => {
            console.error(`Initialization error: ${error}`);
        });
}

/**
 * Initialize STRICH SDK, and if successful, proceed to initialize BarcodeReader.
 */
StrichSDK.initialize('<your license key>')
    .then(() => {
        initializeBarcodeReader();
    })
    .catch(err => {
        window.alert('SDK failed to initialize: ' + err);
    });
