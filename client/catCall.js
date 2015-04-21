/*
* This script is attached to the application where the user "calls" the server to "chat"
* On this page exists a form whose submission sends a POST event to the server
* When POSTing, the server takes the message from the body, and forms a response out of it
* The response is added to the chatWindow div on the application's document
*/

"use strict";

$(document).ready(function() {

	// Describe what is done with a response from the server
	function successfulResponse(result, status, xhr) {
		// The server said something to the user, found in result.responseWord
		var response = result.responseWord || JSON.parse(xhr.responseText).responseWord;

		// Wrap this word in HTML tags so that when added it is styled to fit the page properly
		response = "<p class=\"received\">" + response + "</p>";

		// Add the response to the chat window
		$("#chatWindow").innerHTML += response;
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
			success: successfulResponse,
			error: function(xhr, status, error) {
				var messageObject = JSON.parse(xhr.responseText);
				handleError(messageObject.error);
			}
		});
	}

	// Attach the event listener to the submitMessage link
	$("#sendMessage").on("click", function(e) {
		e.preventDefault();

		// Send the message to the server
		sendAjax($("#catChat").attr("action"), $("#catChat").serialize());
	});
});