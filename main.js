const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const w = new Worker('worker.js');

navigator.mediaDevices.getUserMedia({video: { facingMode: { exact: "environment" } }})
.then(stream => {
    // console.log(stream);
    console.log('Stream active');
    video.srcObject = stream;
})
.catch(error => {
    console.log('Stream failed', error.stack);
});

// setInterval(() => {

//     let ctx = canvas.getContext('2d');

//     // ctx.drawImage(video, 0, 0, 480, 640);

//     bc.detect(video)
//     .then(ba => {
//         if (ba.length) {
//             const b = ba[0];
//             const s = `${b.format}: ${b.rawValue}`;
//             console.log(s);
//             const box = b.boundingBox;
//             ctx.strokeStyle = 'red';
//             ctx.fillStyle = 'red';
//             ctx.lineWidth = 5;
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             ctx.strokeRect(box.x, box.y, box.width, box.height);
//             ctx.fillStyle = 'black';
//             ctx.fillRect(box.x, box.y + box.height + 5, box.width, 34);
//             ctx.font = "24px Arial";
//             ctx.fillStyle = 'red';
//             ctx.fillText(s, box.x, box.y + box.height + 30);
//         }
//     })
//     .catch(e => {
//         console.log(e);
//     });

// }, 100);

w.addEventListener('message', m => {

    // const barcodes = JSON.parse(m.data);

    const barcodes = m.data;
    const barcode = barcodes[0];
    const box = barcode.boundingBox;
    const ctx = canvas.getContext('2d');

    // BUG? Property "format" gets changed to "unknown" somewhere in the message process?
    console.log('main.js', barcodes[0]);

    // Outline barcode
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red';
    ctx.lineWidth = 5;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // Black box to contrast text
    ctx.fillStyle = 'black';
    ctx.fillRect(box.x, box.y + box.height + 5, box.width, 34);

    // Text
    ctx.font = "24px Arial";
    ctx.fillStyle = 'red';
    ctx.fillText(barcode.rawValue, box.x, box.y + box.height + 30);

});

setInterval(() => {

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
