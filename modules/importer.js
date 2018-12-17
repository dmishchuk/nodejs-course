'use strict';
const fs = require('fs');
const eventEmitter = require('./eventEmitter');
const csv = require('csvtojson');
const cTable = require('console.table');

class Importer {
    constructor() {
        eventEmitter.on('changed', (path) => {
            this.import(path).then((data) => {
                console.log('Async method:\n');
                const table = cTable.getTable(data);
                console.log(table);
            });

            csv({ noheader: false, output: "json" })
                .fromString(this.importSync(path))
                .then(data => {
                    console.log('Sync method:\n');
                    const table = cTable.getTable(data);
                    console.log(table);
                });
        });
    }
    import(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', function (err, csvStr) {
                if ( err ) reject(err);
                csv({ noheader: false, output: "json" })
                    .fromString(csvStr)
                    .then(data => {
                        resolve(data);
                    });
            });
        });
    }
    importSync(path) {
        return fs.readFileSync(path, 'utf8');
    }
}

module.exports = Importer;