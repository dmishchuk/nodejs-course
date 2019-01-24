const fs = require('fs');
const program = require('commander');
const csv = require('csvtojson');
const cTable = require('console.table');

function reverse(str) {
    const outputString = str.split('').reverse().join('');
    process.stdout.write(`Input string: '${str}'\nOutput string: ${outputString}\n`);
}
function transform(str) {
    const outputString = str.toUpperCase();
    process.stdout.write(`Input string: '${str}'\nOutput string: ${outputString}\n`);
}
function outputFile(fileName) {
    const filePath = '../data/' + fileName;
    const data = fs.readFileSync(filePath, 'utf8')
    process.stdout.write(data);
}
function convertFromFile(fileName) {
    const filePath = '../data/' + fileName;
    csv({ noheader: false, output: "json" })
        .fromString(fs.readFileSync(filePath, 'utf8'))
        .then(data => {
            const table = cTable.getTable(data);
            process.stdout.write(table);
        });
}
function convertToFile(fileName) {
    const filePath = '../data/' + fileName;
    csv({ noheader: false, output: "json" })
        .fromString(fs.readFileSync(filePath, 'utf8'))
        .then(data => {
            const pathArr = filePath.split('.');
            pathArr[pathArr.length-1] = 'json';
            const newFilePath = pathArr.join('.');
            fs.writeFileSync(newFilePath, JSON.stringify(data));
        });
}

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

program.parse(process.argv);

if(process.argv.length == 2) {
    console.log('There are no arguments for using');
    program.help();
}

