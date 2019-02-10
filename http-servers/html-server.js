const http = require('http');
const fs = require('fs');
const realMessageText = 'Real message text';

http.createServer(function (req, res) {
    const data = fs.readFileSync('../data/index.html', 'utf8');
    const parsedContent = data.replace(/{message}/g, realMessageText);
    fs.writeFileSync('../data/index.html', parsedContent);
    const src = fs.createReadStream('../data/index.html');
    src.pipe(res);
}).listen(8124);
