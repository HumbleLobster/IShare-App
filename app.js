const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const markdown = require('marked');
const sanitizeHtml = require('sanitize-html');

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

app.use(function(req,res,next){
    res.locals.filter = function(content){
      return markdown(sanitizeHtml(content));
    }
    res.locals.errors = req.flash("errors");
    res.locals.success = req.flash("success");
    res.locals.username = req.session.username;
    res.locals.avatar = req.session.avatar;
  next();
})

app.use(router);


const server = require('http').Server(app);
const io = require('socket.io')(server);

io.use(function(socket,next) {
  sessionOptions(socket.request,socket.request.res,next);
});

io.on('connection', (socket) => {
  if(socket.request.session.username){
    socket.on('chat message', (msg) => {
      io.emit('chat message', {message : msg , id : socket.id , user : socket.request.session});
    });
  }
});


module.exports = server;