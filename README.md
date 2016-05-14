# What is it?

A sax-style parser for CommerceMl (1C).

# Install

`npm install commerceml-js`

# How to use?

```JavaScript

var fs = require('fs');
var commerceMl = require('commerceml-js');

var stream = commerceMl.createStream('import');

stream.on('commercialInfo', function(data) {
    console.log('commercialInfo:', data);
});

stream.on('classifier', function(data) {
    console.log('classifier', data);
});

stream.on('classifierGroup', function(data) {
    console.log('classifierGroup', data);
});

stream.on('classifierProperty', function(data) {
    console.log('classifierProperty', data);
});

stream.on('catalog', function(data) {
    console.log('catalog', data);
});

stream.on('product', function(data) {
    console.log('product', data);
});

stream.on('packageOffers', function(data) {
    console.log('packageOffers', data);
});

stream.on('offer', function(data) {
    console.log('offer', data);
});

stream.on("error", function(error) {
    console.log('error', error);
});

fs.createReadStream("./data/import.xml").pipe(stream);

```

# Methods

`createStream(<type>)`, where type can be:

- "import" - if you are parsing import.xml file.

- "offers" - if you are parsing offers.xml file.

`pause()`

`resume()`