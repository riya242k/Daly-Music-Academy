// import dependencies you will use
const express = require('express');
const path = require('path');
//const bodyParser = require('body-parser'); // not required for Express 4.16 onwards as bodyParser is now included with Express
// set up expess validator
const { check, validationResult } = require('express-validator'); //destructuring an object
// const fileupload = require('express-fileupload');

// For adding login/logout
const session = require('express-session');
// install mongoose
// fetch mongoose into the project
const mongoose = require('mongoose');

// set up variables to use packages
var myApp = express();

// 3. connect to DB
mongoose.connect('mongodb://127.0.0.1:27017/Daly-Music-Academy');   // localhost could also be called 127.0.0.1 in case it doesnot work 127.0.0.1:27017/mydatabase

// myApp.use(bodyParser.urlencoded({extended:false})); // old way before Express 4.16
myApp.use(express.urlencoded({ extended: false })); // new way after Express 4.16
// Bodyparser does not handles files.. we will user npm file upload (npm i express-fileupload)
//myApp.use(fileupload());


// set path to public folders and view folders

myApp.set('views', path.join(__dirname, 'views'));

//use public folder for CSS etc.

myApp.use(express.static(__dirname + '/public'));
myApp.set('view engine', 'ejs');


// Define model for storing user created tickets to DB
const RegisteredUser = mongoose.model('RegisteredUser', {
    userId: String,
    userName: String,
    userAddress: String,
    userEmail: String,
    userPhone: Number,
    userAge: Number,
    userPlayingLevel: String,
    userExperienceInYears: Number,
    userInstrument: String,
    userStatus: String,
    userPaymentStatus: String,
    userIsLoginCreated: Boolean
});

// Define model for storing user created tickets to DB
const EnrolledUser = mongoose.model('EnrolledUser', {
    userName: String,
    userPassword: String,
    userStatus: String,
    userPaymentStatus: String,
    userIsLoginCreated: Boolean
});

// create a model for admin users
const AdminUser = mongoose.model('AdminUser', {
    username: String,
    password: String
});


//setup body parser ( to fetch the response)
myApp.use(express.urlencoded({ extended: false }));

myApp.use(session({
    secret: 'iwishitwas16decalready1282022', // should be unique for each application
    resave: false,
    saveUninitialized: true
}));

// set up different routes (pages) of the website
// render the home page
myApp.get('/', function (req, res) {
    res.render('homepage'); // will render views/home.ejs
});


//login route
myApp.get('/login', function (req, res) {
    res.render('loginPage');
});

//logout route
myApp.get('/logout', function (req, res) {
    req.session.username = ''; // reset the username
    req.session.loggedIn = false; // make logged in false from true
    res.redirect('/login');
});

// login process page
myApp.post('/loginProcess', function (req, res) {
    // fetch user input for uname pwd
    var username = req.body.username;
    var password = req.body.pwd;

    // find entry in database based on the username and password
    AdminUser.findOne({ username: username, password: password }).exec(function (err, adminUser) {

        // adminUser would be true if there is entry matching the user entered values in DB
        if (adminUser) {
            // save in session
            req.session.username = adminUser.username;
            req.session.loggedIn = true;
            // redirect admin to dashboard if found
            res.redirect('/dashboard');
        }
        else {
            // send an error message to user view if incorrect username password are entered
            var pageData = {
                error: 'Unauthorised Access! Try Again'
            }
            // stay on login page only
            res.render('loginPage', pageData);
        }
    });
});

// Setup to create a user entry for the admin user for the first time.
// This setup needs to be run manually for this project only, not for actual real time implementation
myApp.get('/setup', function (req, res) {
    var adminData = {
        username: 'admin',
        password: 'admin'
    }

    // Create an instance of the admin model, pass the data to be saved and save the entry.
    var newAdmin = new AdminUser(adminData);
    newAdmin.save();
    res.send('User setup successful');
});


//submit process to take user inputs for bug ticket and save the record to DB
myApp.post('/submitRegistration', function (req, res) {
    // fetching the user inputs
    console.log("Request Body");
    console.log(req.body);
    var userId = "123";
    var userName = req.body.username;
    var userAddress = req.body.address;
    var userEmail = req.body.email;
    var userPhone = req.body.phone;
    var userAge = req.body.age;
    var userPlayingLevel = req.body.playingLevel;
    var userExperienceInYears = req.body.yearsOfPlayingExperience;
    var userInstrument = req.body.instrument;
    var userIsLoginCreated = false;
    var userPaymentStatus = "Pending";
    var userStatus = "Inactive";

    // create an object with the fetched data to send to the view
    var pageData = {
        userId: userId,
        userName: userName,
        userAddress: userAddress,
        userEmail: userEmail,
        userPhone: userPhone,
        userAge: userAge,
        userPlayingLevel: userPlayingLevel,
        userExperienceInYears: userExperienceInYears,
        userInstrument: userInstrument,
        userIsLoginCreated: userIsLoginCreated,
        userPaymentStatus: userPaymentStatus,
        userStatus: userStatus
    }
    // Create an instance of the userTicket model, pass the data to be saved and save the entry.
    var newUserRegistration = new RegisteredUser(pageData);
    newUserRegistration.save();
    var responseData = {
        resMessage: 'Your request has been successfully submitted'
    }
    // send the data to the view and render it
    res.render('messagePage', responseData);
});

myApp.get('/adminRegisteredStudents', function (req, res) {
    // to fetch the data from DB
    RegisteredUser.find({}).exec(function (err, registeredUsers) {
        var pageData = {
            registeredUsers: registeredUsers
        }
        res.render('adminRegisteredStudents', pageData); // will render views/list.ejs
        // pass the data fetched from DB to the target page
        // res.render('list', { christmasIds: christmasIds }); // will render views/list.ejs

    });
});

// edit process page to update the data in DB
myApp.post('/editRegisteredSudentsSuccess', function (req, res) {
    console.log('req body reg:');
    console.log(req.body);
    console.log('req body length reg:');
    console.log(req.body.id.length);

    for (var i = 0; i < req.body.id.length; i++) {

        RegisteredUser.findByIdAndUpdate(req.body.id[i], {
            userId: req.body.userId[i],
            userName: req.body.username[i],
            // userAddress: req.body.address[i],
            userEmail: req.body.userEmail[i],
            userPhone: req.body.userPhone[i],
            userAge: req.body.userAge[i],
            // userPlayingLevel: req.body.playingLevel[i],
            // userExperienceInYears: req.body.yearsOfPlayingExperience[i],
            userInstrument: req.body.userInstrument[i],
            userIsLoginCreated: req.body.userIsLoginCreated[i],
            userPaymentStatus: req.body.userPaymentStatus[i],
            userStatus: req.body.userStatus[i],
        },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Updated Successfully : ");
                }
            });
    }

    //create an object to send to the view
    var responseData = {
        resMessage: 'Your request has been successfully updated'
    }
    //create an object to send to the view
    res.render('messagePage', responseData);
});

myApp.post('/adminCreateLogin', function (req, res) {
    // fetching the user inputs
    console.log("Request Body");
    console.log(req.body);
    var userName = req.body.username; //IMP: keep this as email, to have some link in reg and login record
    var userPassword = req.body.password;
    var userIsLoginCreated = true;
    var userPaymentStatus = "clear";
    var userStatus = "active";

    // create an object with the fetched data to send to the view
    var pageData = {
        userName: userName,
        userPassword: userPassword,
        userIsLoginCreated: userIsLoginCreated,
        userPaymentStatus: userPaymentStatus,
        userStatus: userStatus
    }

    // Create an instance of the userTicket model, pass the data to be saved and save the entry.
    var newUserEnrollment = new EnrolledUser(pageData);
    newUserEnrollment.save();
    var responseData = {
        resMessage: 'Your request has been successfully submitted'
    }
    // send the data to the view and render it
    res.render('messagePage', responseData);
});

myApp.get('/adminEnrolledStudents', function (req, res) {
    // to fetch the data from DB
    EnrolledUser.find({}).exec(function (err, enrolledUsers) {
        var pageData = {
            enrolledUsers: enrolledUsers
        }
        res.render('adminEnrolledStudents', pageData); // will render views/list.ejs
        // pass the data fetched from DB to the target page
        // res.render('list', { christmasIds: christmasIds }); // will render views/list.ejs

    });
});

// edit process page to update the data in DB
myApp.post('/editEnrolledSudentsSuccess', function (req, res) {
    console.log('req body:');
    console.log(req.body);
    console.log('req body length:');
    console.log(req.body.id.length);
    for (var i = 0; i < req.body.id.length; i++) {

        EnrolledUser.findByIdAndUpdate(req.body.id[i], {
            userName: req.body.username[i],
            userPassword: req.body.userPassword[i],
            userIsLoginCreated: req.body.userIsLoginCreated[i],
            userPaymentStatus: req.body.userPaymentStatus[i],
            userStatus: req.body.userStatus[i]
        },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Updated Successfully : ");
                }
            });

    }
    // console.log('enrolledUsersArray:');
    // console.log(enrolledUsersArray);
    var responseData = {
        resMessage: 'Your request has been successfully updated'
    }
    //create an object to send to the view
    res.render('messagePage', responseData);
});

myApp.get('/adminCreateStudentLogin', function (req, res) {
    res.render('adminCreateStudentLogin.ejs'); // will render views/faq.ejs
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
myApp.get('/rockAndOrchestraCamp', function (req, res) {
    res.render('rockAndOrchestraCamp'); // will render views/rockAndOrchestraCamp.ejs
});
myApp.get('/musicLessons', function (req, res) {
    res.render('musicLessons'); // will render views/timetable.ejs
});

myApp.get('/adminDashboard', function (req, res) {
    res.render('adminDashboard'); // will render views/timetable.ejs
});

// start the server and listen at a port
myApp.listen(8020);

//tell everything was ok
console.log('Everything executed fine.. Open http://localhost:8020/');


