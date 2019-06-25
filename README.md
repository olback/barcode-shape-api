# Barcode Scanner using the Shape API with Web Workers.

A simple proof of concept using the shiny new shape API and Web Workers.

### Bugs?
1. As of writing this (06/25/2019) there seems to be a bug that changes the `format` property on the `DetectedBarcode` object. We get the correct output when logging `DetectedBarcode` in the worker. Logging that same exact object when recieved in `main.js` shows `format: "unknown"`. All other properties are intact.

2. There might also be a memory leak somewhere. Not confirmed yet.
