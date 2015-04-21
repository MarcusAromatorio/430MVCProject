/*
* This script is included on both the login and signup page and details how one logs in and signs up
* Utilizes JQuery and forms an ajax request
*/

"use strict";

$(document).ready(function() {
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
			success: function(result, status, xhr) {
				window.location = result.redirect; // Results from either logging in or signing up are both redirects
			},
			error: function(xhr, status, error) {
				var messageObject = JSON.parse(xhr.responseText);
				handleError(messageObject.error);
			}
		});
	}
	// The following functions get added to their associated pages (login versus signup)

	// Sign up a new user, making sure they enter correct information in all fields
	$("#signupSubmit").on("click", function(e) {
		e.preventDefault(); // Stop the default action of clicking on the object from occuring

		// Ensure the user filled out all fields
		if($("#user").val() == '' || $("#pass").val == '' || $("#pass2").val() == '') {
			handleError("All fields are required to sign up");
			return false;
		}

		// Ensure both passwords match before signing user up
		if($("#pass").val() !== $("#pass2").val()) {
			handleError("Both passwords must match!");
			return false;
		}

		// Sign up the user by sending the request through
		sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

		return false;
	});

	// Log in an existing user
	$("#loginSubmit").on("click", function(e) {
		e.preventDefault();

		// Ensure the user filled out all fields
		if($("#user").val() == '' || $("#pass").val == '') {
			handleError("Both username and password must be filled out");
			return false;
		}

		// Log in the user by sending the request through
		sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());
	});
});