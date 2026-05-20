/**
 * Import STRICH SDK via ES6 import clause. It is recommended to pin a specific version, especially for
 * business-critical applications.
 */
import {StrichSDK, PopupScanner} from "https://cdn.jsdelivr.net/npm/@pixelverse/strichjs-sdk@1.16.0";

try {
    await StrichSDK.initialize('<your license key>');
} catch (err) {
    alert(err.message);
}

// serial number: 15 characters, at least one non-digit (enforced programmatically)
document.getElementById('scan_serial').onclick = async () => {
    const pattern = document.getElementById('serial').pattern;
    const cfg = {
        symbologies: [{name: 'code128', 'minLen': 15, 'maxLen': 15}],
        detectionHandler: (detections) => detections.some(d => d.data.match(pattern) && d.data.match('[A-Z]'))
    };
    const detections = await PopupScanner.scan(cfg);
    if (detections) {
        document.getElementById('serial').value = detections.find(d => d.data.match(pattern) && d.data.match('[A-Z]')).data;
    }
}

// MAC: 6 pairs of alphanumeric characters, separated by colons: AB:CD:12:34:EF:AD
document.getElementById('scan_mac').onclick = async () => {
    const pattern = document.getElementById('mac').pattern;
    const cfg = {
        symbologies: [{name: 'code128', 'minLen': 17, 'maxLen': 17}],
        detectionHandler: (detections) => {
            return detections.some(d => d.data.match(pattern));
        },
        labels: {
            title: 'Scan MAC Address'
        }
    };
    const detections = await PopupScanner.scan(cfg);
    if (detections) {
        document.getElementById('mac').value = detections.find(d => d.data.match(pattern)).data;
    }
}

// IMEI: 15 to 17 digits
document.getElementById('scan_imei').onclick = async () => {
    const pattern = document.getElementById('imei').pattern;
    const cfg = {
        symbologies: [{name: 'code128', 'minLen': 15, 'maxLen': 17}],
        detectionHandler: (detections) => {
            return detections.some(d => d.data.match(pattern));
        },
        labels: {
            title: 'Scan IMEI'
        }
    };
    const detections = await PopupScanner.scan(cfg);
    if (detections) {
        document.getElementById('imei').value = detections.find(d => d.data.match(pattern)).data;
    }
}


document.getElementById('scan_all').onclick = async () => {
    let codes = {
        imei: undefined, serial: undefined, mac: undefined
    }
    await PopupScanner.scan({
        symbologies: [{name: 'code128', 'minLen': 15, 'maxLen': 17}],
        detectionHandler: (detections) => {
            if (!codes.mac) {
                const pattern = document.getElementById('mac').pattern;
                const detection = detections.find(d => d.data.match(pattern));
                if (detection) {
                    codes.mac = detection.data;
                }
            }
            if (!codes.serial) {
                const pattern = document.getElementById('serial').pattern;
                const detection = detections.find(d => d.data.match(pattern) && d.data.match('[A-Z]'));
                if (detection) {
                    codes.serial = detection.data;
                }
            }
            if (!codes.imei) {
                const pattern = document.getElementById('imei').pattern;
                const detection = detections.find(d => d.data.match(pattern));
                if (detection) {
                    codes.imei = detection.data;
                }
            }

            // we're done if we have all three fields
            return codes.mac && codes.imei && codes.serial;
        }
    });

    document.getElementById('mac').value = codes.mac;
    document.getElementById('serial').value = codes.serial;
    document.getElementById('imei').value = codes.imei;
}
