const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require("./models/User");
const flash = require('connect-flash');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const cottagesRouter = require('./routes/cottages');
const aboutRouter = require('./routes/about');

const reservationsRouter = require('./routes/reservations');

const keys = require("./config/keys");
const seedDB = require("./seedDB");

const useRemote = true; // select remote or local from config/keys.js
const localDBName = "/cottetsi";
const resetLocalDB = false; // empty the local DB and populate with initial data

const app = express();
//console.log(keys.mongoURI.remote);
// mongodb setup
mongoose.connect(useRemote ? keys.mongoURI.remote:keys.mongoURI.local+localDBName, {useNewUrlParser: true})
    .then(()=>{
        console.log("mongoose connected.");
        if(!useRemote) seedDB(resetLocalDB);
    },(err)=>{
        console.error(err);
        console.log("mongoose failed to connect!");
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// body-parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set up flash messages
app.use(flash());

// passport config
app.use(require("express-session")({
    secret: "sdmjnge73jmlzxcbnf740pqwk4mzpikwijhg7fo0su",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// top-level middleware
app.use(function(req, res, next){
    res.locals.siteName = "Cott Etsi";
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// setup routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/cottages", cottagesRouter);
app.use(aboutRouter);
app.use('/reservations', reservationsRouter);

// --------------------------------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
