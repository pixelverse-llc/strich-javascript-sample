
// show the previously scanned code from 'Single Scan', if available
const scannedCode = sessionStorage.getItem('scannedCode');
if (scannedCode === null) {
    document.getElementById('lastScannedCode').style.display = 'none';
} else {
    document.getElementById('lastScannedCode').style.display = 'block';
    document.getElementById('lastScannedCodeValue').innerText = scannedCode;
}
