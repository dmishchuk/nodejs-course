'use strict';
const eventEmitter = require('./eventEmitter');

class Importer {
    constructor() {
        eventEmitter.on('changed', (filename) => {
            console.log('changed');
        });
    }
}

module.exports = Importer;