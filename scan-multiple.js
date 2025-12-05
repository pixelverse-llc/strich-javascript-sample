/**
 * Import STRICH SDK via ES6 import clause. It is recommended to pin a specific version, especially for
 * business-critical applications.
 */
import {StrichSDK, BarcodeReader} from "https://cdn.jsdelivr.net/npm/@pixelverse/strichjs-sdk@1.12.1";

let theBarcodeReader = null;

// data and hooks for popup dialog
let numScannedCodes = 0;
let scannedCodes = ['', '', '', ''];

const finishButton = document.getElementById('finishScanning')
finishButton.onclick = async () => {
    theBarcodeReader.destroy();
    window.location.replace('/');
}

/**
 * Scan 4 distinct barcodes and then stop.
 */
function handleCodeDetection(codeDetection) {
    if (numScannedCodes < 4 && scannedCodes.indexOf(codeDetection.data) === -1) {
        scannedCodes[numScannedCodes] = codeDetection.data;
        sessionStorage.setItem('scannedCode', codeDetection.data);
        document.getElementById('scannedCode' + numScannedCodes).innerText = codeDetection.data;
        numScannedCodes++;

        // stop barcode detection when we have all the codes we need
        if (numScannedCodes === 4) {
            theBarcodeReader.stop();
            finishButton.disabled = false;
        }
    }
}

/**
 * Initialize STRICH BarcodeReader and start scanning.
 */
async function initializeBarcodeReader() {

    // see https://docs.strich.io/reference/interfaces/Configuration.html for all available options
    let configuration = {
        selector: '.barcode-scanner',
        frameSource: {
            resolution: 'full-hd'
        },
        engine: {
            symbologies: ['code128', 'qr'],
            duplicateInterval: 1500
        }
    };

    // initialize BarcodeReader and start scanning barcodes
    try {
        const barcodeReader = await new BarcodeReader(configuration).initialize();
        barcodeReader.detected = (detections) => {
            handleCodeDetection(detections[0]);
        };
        theBarcodeReader = barcodeReader;
        await theBarcodeReader.start();
    } catch (err) {
        window.alert(`Failed to initialize BarcodeReader: ${err.message} ${err.detailMessage}`);
    }
}

/**
 * Handle initialization error. All exceptions thrown by the SDK are of type SdkError:
 * https://docs.strich.io/reference/classes/SdkError.html
 *
 * This is just for illustration, in a production app you would not be using window.alert().
 */
function handleInitializationError(err) {
    let message = err.message;
    if (err.detailMessage) { // some errors contain additional details in the detailMessage property
        message += '\n' + err.detailMessage;
    }
    window.alert(`Initialization failed: ${message}`);
}

// Initialize STRICH SDK and BarcodeReader
const licenseKey = '<your license key>';
try {
    await StrichSDK.initialize(licenseKey);
    await initializeBarcodeReader();
} catch (err) {
    handleInitializationError(err);
}
