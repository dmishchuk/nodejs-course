'use strict';
const fs = require('fs');
const events = require('events').EventEmitter;
const eventEmitter = new events();


class DirWatcherthat {
    constructor(dir, delay) {
        fs.watch(dir, {
            aggregateTimeout: delay
        }, (eventType, filename) => {
            eventEmitter.emit('changed', filename);
        });
        console.log('DirWatcher module');
    }
}

module.exports = DirWatcherthat;