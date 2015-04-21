/*
* The index of the middleware script is the first file that gets executed when a directory is passed in to require()
* This script defines extra behaviors for the router to enable like requiring a user to be logged in or out
*/

// This middleware function makes sure the instance of account on the session is active
// If it isn't, the response is sent to redirect the user to the login page
var requiresLogin = function(request, response, next) {
	if(!request.session.account) {
		return response.redirect('/');
	}

	next();
};

// This middleware function makes sure the user is logged OUT, otherwie sending them to the calls page
var requiresLogout = function(request, response, next) {
	if(!request.session.account) {
		return response.redirect('/calls');
	}

	next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;