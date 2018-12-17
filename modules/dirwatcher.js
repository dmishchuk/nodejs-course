'use strict';
const fs = require('fs');
const eventEmitter = require('./eventEmitter');
let watchDelay;

class DirWatcherthat {
    constructor(dir, delay) {
        fs.watch(dir, null, (eventType, filename) => {
            if (!watchDelay) {
                eventEmitter.emit('changed', {
                    filename: filename.split('___jb_tmp___')[0],
                    dir
                });
                watchDelay = setTimeout(function() { watchDelay = null }, delay);
            }
        });
        console.log('DirWatcher module');
    }
}

module.exports = DirWatcherthat;