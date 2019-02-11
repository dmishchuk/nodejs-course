const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
app.use(cookieParser());
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send(fs.readFileSync('./data/addProduct.html', 'utf8'));
}).get('/api/products', (req, res) => {
    res.send(fs.readFileSync('./data/data.json', 'utf8'));
}).get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const products = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));
    for (product of products) {
        if (product.id === +id) {
            res.send(JSON.stringify(product));
        }
    }
    res.send('not found :(');
}).get('/api/products/:id/reviews', (req, res) => {
    const { id } = req.params;
    const products = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));
    for (product of products) {
        if (product.id === +id) {
            res.send(product.options);
        }
    }
    res.send('not found :(');
}).get('/api/users', (req, res) => {
    const users = [];
    const products = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));
    for (product of products) {
        users.push(product.name);
    }
    res.send(JSON.stringify(users));
}).post('/api/products', (req, res) => {
    const newProduct = req.body;
    const products = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));
    newProduct.id = products.length+1;
    products.push(newProduct);
    fs.writeFileSync('./data/data.json', JSON.stringify(products));
    res.send(JSON.stringify(newProduct));
});

app.listen(port, () => console.log(`App listening on port ​${port}​!`));