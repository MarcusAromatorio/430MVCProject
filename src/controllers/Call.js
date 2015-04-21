/*
* The Call.js script defines the behavior that takes place with requests concerning the cat-call service
* Cat Calling is a simple "chat" interface that responds to user input with "meow"
*/

// Define the function that sends the user the page to chat with
var callPage = function(request, response) {

	// This function is protected by middleware which requres the user to be logged in
	// This function executing means that a user is, in fact, logged in
	response.render('chat');
};

// Define how a user "chats" with the server
var chat = function(request, response) {

	// This function isn't explicitly protected by middleware because it shouldn't be called without already passing through it once
	// For safety's sake, make sure the user is logged in. If not, redirect them to the login page (root directory)
	if(!request.session.account) {
		return response.redirect('/');
	}

	// The chat function takes the request's body and analyzes the message property that sends with POST
	// The response is based on how many letters are in the message
	var responseLetters = request.body.message.length;

	var responseWord = 'Me';

	for (var i = 0; i < responseLetters; i++) {
		responseWord += 'o';
	}

	responseWord =+ 'w';

	// Yep. The server says 'Meow' back to the user, depending on how many letters the user sends in their message
	// Could say 'mew' if the user sends an empty message
	response.json({word: responseWord});

};

module.exports.callPage = callPage;
module.exports.chat = chat;