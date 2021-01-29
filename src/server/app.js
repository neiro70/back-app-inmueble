var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var dbConfig = require('./db');
var mongoose = require('mongoose');
// Connect to DB
const mongooseOptions = { useFindAndModify: false };
mongoose.connect(dbConfig.url, mongooseOptions)
    .then(db => console.log("DB is connected"))
    .catch(err => console.error(err));

var app = express();

// Middleware - CORS ommit on production
/*
app.use(cors({
        origin: 'http://localhost:4200',
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST'],
        credentials: true
    }
));
*/
var allowedOrigins = ['http://localhost:4202'];
app.use(cors({
    origin: function (origin, callback) {    // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true); if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        } return callback(null, true);
    }
}
));

app.options('*', cors());
// Middleware - CORS end

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
// Sustituir bodyParser.json por express.json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({ secret: 'mySecretKey' }));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/api', routes);
var users = require('./routes/users');
app.use('/users', users);
var catalogs = require('./routes/catalogs');
app.use('/catalogs', catalogs);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;
