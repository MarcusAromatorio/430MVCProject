/*
* This Model View Controller project is written in javascript to demostrate understanding of the MVC pattern
* RIT Interactive Games & Media 430: Rich Media Web Apps 2
*
* This application allows users to connect to a profile and "chat" to the server
* The server responds to the user as if it were a cat meowing at a person
*
* Code is borrowed from Cody Van De Mark's in-class examples on the MVC pattern
* Code purpose and usage is detailed in comments to display understanding
* 
*/

// To start the server, import all necessary libraries installed via npm
var path = require('path');                         // Used to form absolute file paths from relative file paths to prevent exploits
var express = require('express');                   // Use the express library to easily route HTTP requests, render pages, configure middleware, and register templating engines
var compression = require('compression');           // Compression used for zipping HTML packets for faster delivery
var favicon = require('serve-favicon');             // Favicon serving made easy, just have a path to a favicon image file
var cookieParser = require('cookie-parser');        // Easy and optimized parsing of HTTP cookies for user data
var bodyParser = require('body-parser');            // Easy and optimized parsing of the body of a page to pull relevant data for requests and responses
var mongoose = require('mongoose');                 // Fast, powerful interface with the MongoDB database linked to the project
var session = require('express-session');           // Express sessions to ensure user profiles can stay connected
var RedisStore = require('connect-redis')(session); // Interface with the Redis cloud so sessions can authenticate quickly and safely

// Locate the database URI (uniform resource identifier) to store data. When pushed to Heroku, process.env.MONGOLAB_URI will be defined automatically
var dbURI = process.env.MONGOLAB_URI || "mongodb://localhost/catcalling";

// With the URI set, connect to the database, saving reference as 'db'
var db = mongoose.connect(dbURI, function(error) {
    // In this function, check if an error exists
    // If there is an error, the server cannot run and needs fixing!
    if(error) {
        console.log("Could not connect to the database");
        throw error;
    }
    // Otherwise, mongoose connects to the database for us to use
});

// Define routes that the server uses to guide users across the application
var router = require('./router.js');

// Define the server that will later be instructed to listen to a port location
var server;

// Define the port to be listened to once Express sets up the application properly
// The first two definitions are Heroku specific, locally hosting on port 3000
var port = process.env.PORT || process.env.NODE_PORT || 3000;

// Define the express application that allows for routing, rendering, middleware, and templating
var app = express();

// Give the app the assets that the project utilizes, located in the client directory
app.use('/assets', express.static(path.resolve(__dirname + '../../client/')));

// Give the application the compression algorithm to speed HTTP packet delivery
app.use(compression());

// Give the application the body parser to ease request interpretation and response delivery
app.use(bodyParser.urlencoded({
    extended: true
}));

// Define the session that RedisStore will use to keep users logged in and authenticated
app.use(session({
    store: new RedisStore(),
    secret: 'Cat Facts',
    resave: true,
    saveUninitialized: false
}));

// Define the application's view engine as 'jade', which gives us control over the object oriented templating language jade
app.set('view engine', 'jade'); // Explicitly tells the application to look for files with .jade extensions

// Define the views directory for the application to find the .jade files to be used in rendering HTML markup
app.set('views', path.resolve(__dirname + '/views'));

// Define the favicon file to be served on the favicon request
app.use(favicon(path.resolve(__dirname + '/../client/img/favicon.png')));

// Give the application reference to the cookie parser so that saved data is easy to access
app.use(cookieParser());

// Define the routes that the application serves once requested
router(app);    // Modifies the app object with added functionality

// Start off the server by listening on the predefined port
server = app.listen(port, function (error){
    // If an error occurs here, the server did not start up correctly
    if(error){
        throw error;
    }
    // Otherwise, the server is listening and waiting for connections to handle
    console.log('listneing on port ' + port);
});