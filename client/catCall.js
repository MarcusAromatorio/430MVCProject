/*
* This script is attached to the application where the user "calls" the server to "chat"
* On this page exists a form whose submission sends a POST event to the server
* When POSTing, the server takes the message from the body, and forms a response out of it
* The response is added to the chatWindow div on the application's document
*/

"use strict";

$(document).ready(function() {

	// When the user decides to post a message to Cat
	function postChatMessage(message) {
		// Wrap the message in HTML to style it properly
		var wrapped = "<p class=\"sent\">You: " + message + "</p>";

		// Add the message to the chat window
		$("#chatWindow").append(wrapped);
	}


	// Describe how the application handles errors
	function handleError(message) {
		// Just log the message to the console of the window
		console.log("Error: " + message);
		$("#errorMessage").text(message);
	}

	// Describe how the ajax request is formatted
	function sendAjax(action, data) {
		$.ajax({
			cache: false,
			type: "POST",
			url: action,
			data: data,
			dataType: "json",
			success: function(result, status, xhr){
				// The server said something to the user, found in result.word
				var response = result.word;

				// Wrap this word in HTML tags so that when added it is styled to fit the page properly
				var responseWrapped = "<p class=\"received\">" + response + "</p>";

				// Add the response to the chat window
				$("#chatWindow").append(responseWrapped);

			},
			error: function(xhr, status, error) {
				var messageObject = JSON.parse(xhr.responseText);
				handleError(messageObject.error);
			}
		});
	}

	// Attach the event listener to the submitMessage link
	$("#sendMessage").on("click", function(e) {
		e.preventDefault();

		// Post the chat message to the chat window
		postChatMessage($("#message").val());

		// Send the message to the server
		sendAjax($("#catChat").attr("action"), $("#catChat").serialize());
	});
});