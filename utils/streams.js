const fs = require('fs');
const program = require('commander');

program
    .option('-a, --actions [action]', 'Set action', (action) => {
        console.log(action);
    })
    .option('-f, --file [filename]', 'Set filename', (filename) => {
        console.log(filename);
    });

program.command('*').action(() => {
    console.log('Wrong input, please check the instruction');
    program.help();
});

program.parse(process.argv);

if(process.argv.length == 2) {
    console.log('There are no arguments for using');
    program.help();
}

function reverse(str) { /* ... */ }
function transform(str) { /* ... */ }
function outputFile(filePath) { /* ... */ }
function convertFromFile(filePath) { /* ... */ }
function convertToFile(filePath) { /* ... */ }