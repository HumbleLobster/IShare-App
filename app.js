const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

const app = express();
const ejs = require('ejs');
const router = require('./router');

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine' , 'ejs');
app.set('views', 'views');

let sessionOptions = session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({client: require('./db')}),
    cookie: {maxAge : 1000*60*60*24}
  })

app.use(flash());
app.use(sessionOptions);

app.use(router);

module.exports = app;