const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const config = require('./config');

const app = express();
app.use(cookieParser());

app.use(bodyParser.urlencoded({
    extended: false
}));

require('./auth').init(app);

const userScheme = new Schema({
    firstName: String,
    lastName: String,
    email: String
});

const productScheme = new Schema({
    name: String,
    model: String,
    price: Number
});
mongoose.connect("mongodb://localhost:27017/usersdb", { useNewUrlParser: true });
  
const User = mongoose.model("User", userScheme);
const user = new User({
    firstName: "Dmytro",
    lastName: "Mishchuk",
    email: "dmishchuk@gmail.com"
});
  
user.save(function(err){
    mongoose.disconnect();  // отключение от базы данных
      
    if(err) return console.log(err);
    console.log("User created: ", user);
});

mongoose.connect("mongodb://localhost:27017/productsdb", { useNewUrlParser: true });
  
const Product = mongoose.model("Product", productScheme);
const product = new Product({
    name: "book",
    model: "A4 Jane Air",
    price: 32
});
  
product.save(function(err){
    mongoose.disconnect();  // отключение от базы данных
      
    if(err) return console.log(err);
    console.log("Product created: ", product);
});

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
}).get('/city', (req, res) => {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    var data = [];
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("dmishchuk_db");
      dbo.collection("cities").find({}).toArray(function(err, result) {
        if (err) throw err;
        var city = result[Math.floor((Math.random()*result.length))];
        res.send(city);
        db.close();
      });
    });
}).get('/cities', (req, res) => {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    var data = [];
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("dmishchuk_db");
      dbo.collection("cities").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.send(JSON.stringify(result));
        db.close();
      });
    });
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

app.get('/auth/google',
    passport.authenticate('google'));

app.get('/auth/google/callback',
    passport.authenticate('google', { scope: ['profile'] }),
    function(req, res) {
        res.redirect('/');
    });

app.listen(port, () => console.log(`App listening on port ​${port}​!`));