/**
 * Import STRICH SDK via ES6 import clause. It is recommended to pin a specific version, especially for
 * business-critical applications.
 */
import {StrichSDK, BarcodeReader} from "https://cdn.jsdelivr.net/npm/@pixelverse/strichjs-sdk@1.7.4";

/**
 * Store the scanned code in the session storage and return to the home page.
 */
function handleCodeDetection(codeDetection) {
    sessionStorage.setItem('scannedCode', codeDetection.data);
    window.location.replace('/');
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
    const barcodeReader = await new BarcodeReader(configuration).initialize();
    barcodeReader.detected = (detections) => {
        barcodeReader.destroy();
        handleCodeDetection(detections[0]);
    };
    await barcodeReader.start();
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
