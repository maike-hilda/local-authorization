// https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537
// assigns express module to express
var express = require('express');
// initialize express
var app = express();
// import needed modules for authentication
var passport   = require('passport');
var session    = require('express-session');
// to extract body part of incoming request to JSON
var bodyParser = require('body-parser');
// environment variables
var env = require("dotenv").load();
// handlebars
var exphbs = require('express-handlebars');

// Middleware
// to allow app to use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// initialize passport and express session 
app.use(session( { 
    secret: 'keyboard cat',
    resave: true, 
    saveUninitialized:true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');


app.get('/', function(req, res) {
    res.send('Welcome to Passport with Sequelize');
});

//Models
var models = require("./app/models");

//Routes
var authRoute = require('./app/routes/auth.js')(app, passport);

//load passport strategies
require('./app/config/passport/passport.js')(passport, models.user);

//Sync Database
models.sequelize.sync().then(function() {
    
    console.log('Nice! Database looks fine')

}).catch(function(err) {

    console.log(err, "Something went wrong with the Database Update!")

});

// start server
app.listen(3000, function(err) {
    if (!err) {
        console.log("Site is live");
    } else {
        console.log(err);
    }
});



