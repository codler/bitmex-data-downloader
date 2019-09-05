# Bitmex data downloader

## Install

```
npm install --save bitmex-data-downloader
```

## Usage

```js
const BDD = require('bitmex-data-downloader');
BDD.download({
    path: 'data',
    startDate: new Date('2017'),
    endDate: new Date('2018'),
});
```