'use strict';
const events = require('events').EventEmitter;
const eventEmitter = new events();

class Importer {
    constructor() {
        eventEmitter.on('changed', (filename) => {
            console.log('changed');
        });
    }
}

module.exports = Importer;