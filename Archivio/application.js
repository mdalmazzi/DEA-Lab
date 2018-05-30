var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var appRoutes = require('./routes/app');
var boxesRoutes = require('./routes/boxes');
var userRoutes = require('./routes/user');
var ideeRoutes = require('./routes/idee');
var scalettaRoutes = require('./routes/scaletta');
var postloginRoutes = require('./routes/postlogin');
var testoRoutes = require('./routes/testo');

var app = express();
mongoose.connect('dea-lab-user:pwd-dea-lab@ds161793.mlab.com:61793/dea-lab');
//mongoose.connect('localhost:27017/massimo');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

//app.use('/home', postloginRoutes);
app.use('/mappa_home', postloginRoutes);
/* app.use('/boxes', boxesRoutes);
app.use('/user', userRoutes);
app.use('/idee', ideeRoutes);
app.use('/scaletta', scalettaRoutes);
app.use('/testo', testoRoutes); */

app.use('/mappa_box', boxesRoutes);
app.use('/user', userRoutes);
app.use('/mappa_idee', ideeRoutes);
app.use('/mappa_scaletta', scalettaRoutes);
app.use('/mappa_testo', testoRoutes);

app.use('/', appRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    return res.render('index');
});

module.exports = app;