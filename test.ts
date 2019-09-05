declare var require: any;
const BDD = require('./index');
BDD.download({
    path: 'data',
    startDate: new Date('2017'),
    endDate: new Date('2018'),
});