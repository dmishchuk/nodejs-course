'use strict';
const fs = require('fs');
const eventEmitter = require('./eventEmitter');

class DirWatcherthat {
    constructor(dir, delay) {
        const files = fs.readdirSync(dir).filter(fn => fn.endsWith('.csv'));
        console.log(files);
        for (const filename of files) {
            const path = dir ?  `${dir}/${filename}`:`./${filename}`;
            console.log(path);
            fs.watchFile(path, { interval: delay }, () => {
                eventEmitter.emit('changed', path);
            });
        }
        console.log('DirWatcher module');
    }
}

module.exports = DirWatcherthat;