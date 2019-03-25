const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const config = require('./config');

const app = express();
app.use(cookieParser());

app.use(bodyParser.urlencoded({
    extended: false
}));

require('./auth').init(app);

app.use(session({
    store: new RedisStore({
        url: config.redisStore.url
    }),
    secret: config.redisStore.secret,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

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

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/auth/twitter',
    passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.listen(port, () => console.log(`App listening on port ​${port}​!`));