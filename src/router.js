/*
* The router script defines all of the behaviors that the server undergoes during specific scenarios
* Commonly, these scenarios are GET and POST methods from the client
* 
* In this project, only GET and POST methods are handled, as the project is a simple one
*/

// The controllers for each specific page and their interactions are accessed here
var controllers = require('./controllers');

// The middleware that allows for extra behaviors like authentication
var middleware = require('./middleware');

// Define the routes for different, specific occasions of user action (GET, POST)
// A function object that adds express-style functionality to these HTTP methods
// The router communicates with the Controllers aspect of the MVC pattern
var router = function(app){

	// If the user is attempting to log in, make sure they are logged out first
	app.get('/login', mid.requiresLogout, controllers.Account.loginPage);
	app.post('/login', controllers.Account.login); // POST method from the loginPage routes to the account.login method

	// Route /logout requests to the logout method, which in turn ends session and redirects to the home page
	app.get('/logout', controllers.Account.logout);

	// Route /signup requests to the signup page in the account controller
	app.get('/signup', controllers.Account.signupPage);
	app.post('/signup', controllers.Account.signup); // POST method from signup page routes to account.signup method

	// Route /calls requests to the call page where users may chat with the server. Requires login, handled by middleware
	app.get('/calls', mid.requiresLogin, controllers.CatCall.callPage);
	app.post('/calls', controllers.CatCall.chat); // POST method from catcall page calls the "chat" method of the associated controller

	// The root directory takes users to the login page
	app.get('/', controllers.Account.loginPage);

};

// Export the router module to be used by the server
module.exports = router;