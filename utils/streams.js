const fs = require('fs');
const program = require('commander');

function reverse(str) {
    console.log(str);
}
function transform(str) { /* ... */ }
function outputFile(filePath) {
    console.log(filePath)
}
function convertFromFile(filePath) { /* ... */ }
function convertToFile(filePath) { /* ... */ }

program
    .option('-f, --file [filename]', 'Set filename')
    .option('-a, --action [action]', 'Set action', (action) => {
        const actions = {
            reverse: {
                arg: 'str',
                func: reverse
            },
            transform: {
                arg: 'str',
                func: transform
            },
            outputFile: {
                arg: 'filePath',
                func: outputFile
            },
            convertFromFile: {
                arg: 'filePath',
                func: convertFromFile
            },
            convertToFile: {
                arg: 'filePath',
                func: convertToFile
            },
        };
        if(!actions[action]) {
            console.log('Unknown type of action passed, please try again');
        } else {
            setTimeout(() => {
                const arg = actions[action]['arg'] === 'str' ? program.args[0] : program.file;
                if(!arg) {
                    console.log('Wrong input');
                    return;
                }
                actions[action]['func'](arg);
            }, 1000);
        }
    });

program.command('*').action((command) => {
    console.log(command);
});

program.parse(process.argv);

if(process.argv.length == 2) {
    console.log('There are no arguments for using');
    program.help();
}

