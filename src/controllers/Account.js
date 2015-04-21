/*
* The Account.js script defines the behavior that the server undergoes when the user sends requests pertaining to the account service
* These behaviors allow the processes of logging into the chat service, logging off, and signing up
*/

// To behave properly, the Login page needs access to the database. The database is the 'model' of the MVC pattern
var models = require('../models');

// The model for the login page is loaded here (access to the database)
var Account = models.Account;

// Define the function to serve up the login page
var loginPage = function(request, response) {
	response.render('login'); // Searches for login.jade
};

// Do the same for the signup page
var signupPage = function(request, response) {
	response.render('signup');
};

// Define what happens to the user once they choose to log out
var logout = function(request, response) {
	request.session.destroy(); // End their session
	response.redirect('/'); // Redirect them to the home page
};

// Define the login method
var login = function(request, response) {

	// Gather the username and password using the body-parser
	var username = request.body.username;
	var password = request.body.pass;

	// If either the username or password are undefined, throw an error and do not attempt logging in
	if(!username || !password) {
		return response.status(400).json({error: "Username or Password not entered"});
	}

	// Authenticate the user-pass combination with the Account model of data
	// If authentication fails, respond with an error. Otherwise respond with access to the call page
	Account.AccountModel.authenticate(username, password, function(error, account) {

		// If the error exists or the account isn't returned, something went wrong in authentication
		if(error || !account){
			return response.status(401).json({error: "Wrong username or password!"});
		}

		// Otherwise, Give the account API to the session and redirect the user to the calls page
		request.session.account = account.toAPI();
		response.json({redirect: '/calls'}); // Takes the user to the page that allows cat-calling
	});
};

// Define the method by which a user signs up for an account
var signup = function(request, response) {
	// To sign up, a user must enter a username, then a desired password two times.
	// Successfully doing so results in an account being stored to the Account model

	// Assign a temporary variable to reduce verbose lookups
	var body = request.body;

	// If any of the three fields aren't filled in, return with an error
	if(!body.username || !body.pass || !body.pass2) {
		return response.status(400).json({error: "All fields must be filled out to continue"});
	}

	// If the two passwords aren't the same, return with another error
	if(body.pass !== body.pass2) {
		return response.status(400).json(error: "Both passwords must match"});
	}

	// This point of the method assumes all fields entered and both passwords match
	// Generate a new hash which encrypts the users information to ensure they do not get compromised
	Account.AccountModel.generateHash(body.pass, function(salt, hash) {

		// Create the accountData JSON object
		var accountData = {
			username: body.username,
			salt: salt,
			password: hash
		};

		// Define the newly created account for the user from the defined account data
		var newAccount = new Account.AccountModel(accountData);

		// Save the account to the user's session, and redirect the user to the calls page
		newAccount.save(function(error) {
			// If something went wrong, return with the error
			if(error) {
				console.log(error.message);
				return response.status(400).json({error: "An error occurred in saving your account"});
			}

			// Set the session account to the new account
			request.session.account = newAccount.toAPI();

			// Redirect the user in the response from the server
			response.json({redirect: '/calls'});
		});
	});
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;