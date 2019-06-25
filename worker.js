self.addEventListener('message', m => {

    const bc = new BarcodeDetector();

    const img = m.data;

    bc.detect(img)
    .then(barcodes => {

        if (barcodes.length) {

            self.postMessage(barcodes);
            // Here the "format" property is properly set.
            // Tested with https://en.wikipedia.org/wiki/Barcode#/media/File:UPC-A-036000291452.svg
            // "upc_a" is the expected output.
            console.log('worker.js', barcodes[0]);

            // This can be "fixed" by converting the data to JSON before sending
            // self.postMessage(JSON.stringify(barcodes));

        }

    })
    .catch(e => {

        console.log('Error detecting barcode', e);

    });

}, false);
