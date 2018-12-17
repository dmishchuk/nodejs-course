'use strict';
const fs = require('fs');
const eventEmitter = require('./eventEmitter');
const csv = require('csvtojson');
const cTable = require('console.table');

class Importer {
    constructor() {
        eventEmitter.on('changed', (path) => {
            fs.readFile(path, 'utf8', function (err, csvStr) {
                if ( err ) throw err;
                csv({ noheader: false, output: "json" })
                    .fromString(csvStr)
                    .then((data)=>{
                        const table = cTable.getTable(data);
                        console.log(table);
                        console.log(`Reading ${filename} successfully completed...`);
                    });
            });
        });
    }
}

module.exports = Importer;