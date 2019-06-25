const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const w = new Worker('worker.js');
let bcLoop = null;

navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
.then(stream => {

    // console.log(stream);
    console.log('Stream active');
    video.srcObject = stream;

    // Is BarcodeDetector supported?
    const bc = new BarcodeDetector();
    bc.detect(document.createElement('canvas'))
    .then(_ => {

        // Start barcode detection
        console.log('BarcodeDetector supported.');

        startBarcodeDetection();

    })
    .catch(e => {

        console.log(e.toString());
        alert(e.toString());

    });

})
.catch(e => {
    
    console.log('Stream failed', e);
    alert('Stream failed. No camera available?');

});

w.addEventListener('message', m => {

    // const barcodes = JSON.parse(m.data);
    const barcodes = m.data;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // console.log(barcodes);
    const barcode = barcodes[0];
    // for (const barcode of barcodes) {

        const box = barcode.boundingBox;

        // BUG? Property "format" gets changed to "unknown" somewhere in the message process?
        console.log('main.js', barcode);

        // Outline barcode
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
        ctx.lineWidth = 5;
        ctx.strokeRect(box.x, box.y, box.width, box.height);

        // Black box to contrast text
        ctx.fillStyle = 'black';
        ctx.fillRect(box.x, box.y + box.height + 5, box.width, 34);

        // Text
        ctx.font = "24px Arial";
        ctx.fillStyle = 'red';
        ctx.fillText(barcode.rawValue, box.x, box.y + box.height + 30);

    // }

});

function startBarcodeDetection() {

    bcLoop = setInterval(() => {

        const height = video.clientHeight;
        const width =video.clientWidth;
        const ic = document.createElement('canvas');
        ic.height = height;
        ic.width = width;
        const ctx = ic.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
        const imgd = ctx.getImageData(0, 0, width, height);
        w.postMessage(imgd);
    
    }, 100);

}

function stopBarcodeDetection() {

    clearInterval(bcLoop);

}
