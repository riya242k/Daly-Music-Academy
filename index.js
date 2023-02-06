// import dependencies you will use
const express = require('express');
const path = require('path');
//const bodyParser = require('body-parser'); // not required for Express 4.16 onwards as bodyParser is now included with Express
// set up expess validator
const { check, validationResult } = require('express-validator'); //destructuring an object
const fileupload = require('express-fileupload');

// 1. install mongoose
// 2. fetch mongoose into the project
//const mongoose = require('mongoose');


// set up variables to use packages
var myApp = express();

// 3. connect to DB
//mongoose.connect('mongodb://localhost:27017/mydatabase');   // localhost could also be called 127.0.0.1 in case it doesnot work 127.0.0.1:27017/mydatabase

// myApp.use(bodyParser.urlencoded({extended:false})); // old way before Express 4.16
myApp.use(express.urlencoded({ extended: false })); // new way after Express 4.16
// Bodyparser does not handles files.. we will user npm file upload (npm i express-fileupload)
myApp.use(fileupload());


// set path to public folders and view folders

myApp.set('views', path.join(__dirname, 'views'));

//use public folder for CSS etc.

myApp.use(express.static(__dirname + '/public'));
myApp.set('view engine', 'ejs');

// set up different routes (pages) of the website
// render the home page
myApp.get('/', function (req, res) {
    res.render('homepage'); // will render views/home.ejs
});

myApp.get('/faq', function (req, res) {
    res.render('faq'); // will render views/faq.ejs
});
myApp.get('/instrument_Rent_Purchase', function (req, res) {
    res.render('instrumentRentPurchase'); // will render views/instrumentRentPurchase.ejs
});
myApp.get('/login', function (req, res) {
    res.render('login'); // will render views/login.ejs
});
myApp.get('/register', function (req, res) {
    res.render('register'); // will render views/register.ejs
});
myApp.get('/teachers', function (req, res) {
    res.render('teachers'); // will render views/teachers.ejs
});
myApp.get('/testimonials', function (req, res) {
    res.render('testimonials'); // will render views/testimonials.ejs
});
myApp.get('/timetable', function (req, res) {
    res.render('timetable'); // will render views/timetable.ejs
});
// start the server and listen at a port
myApp.listen(8000);

//tell everything was ok
console.log('Everything executed fine.. Open http://localhost:8000/');


