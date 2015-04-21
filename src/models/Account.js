/*
* The Account model script defines how the database saves information pertaining to individual accounts
* This model is able to lookup accounts by different criteria and to authenticate them safely
*/

// To encrypt, the 'crypto' library is brought in from the node core
// To access and store data to MongoDb, the Mongoose library is brought in
var crypto = require('crypto');
var mongoose = require('mongoose');

// Declare the Model for mongoose to later make out of a schema of data
var AccountModel;
// Define various properties of the encryption algorithm
var iterations = 10000; // Repeat encryption process ten thousand times in one go
var saltLength = 64; // Salts are computer generated "passwords" used to multiply password complexity
var keyLength = 64; // Used in the encryption process

// Define the AccountSchema that mongoose will use to create data for the AccountModel
var AccountSchema = new mongoose.Schema({
	// Four pieces of data go into the AccountSchema
	// USername, Salt, Password, and CreatedDate
	username: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		match: /^[A-Za-z0-9_\-\.]{1,16}$/
	},

	salt: {
		type: Buffer,
		required: true
	},

	password: {
		type: String,
		required: true
	},

	createdData: {
		type: Date,
		default: Date.now
	}
});

// Define methods that the AccountSchema can use
AccountSchema.methods.toAPI = function() {
	// _id is built into the MongoDb document and is guaranteed to be unique
	return {
		username: this.username,
		_id: this._id
	};
};

// AccountSchema must be able to validate passwords
AccountSchema.methods.validatePassword = function(password, callback) {
	// Take the pasword into a local variable
	var pass = this.password;

	// Define the croptography hash function to create the encrypted string
	crypto.pbkdf2(password, this.salt, iterations, keyLength, function (error, hash) {
		// If the hashed string does not match the password, pass false into the callback
		if(hash.toString('hex') !== pass) {
			return callback(false);
		}
		// Otherwise the password matches, return true in the callback
		return callback(true);
	});
};

// Define a static lookup method to find accounts by username
AccountSchema.statics.findByUsername = function(name, callback) {

	// Define the search data to compare in Mongo
	var search = {
		username: name
	};

	// Return the result of finding the first match in the AccountModel
	return AccountModel.findOne(search, callback);
};

// Define the static method that generates a hash string
AccountSchema.statics.generateHash = function(password, callback) {
	// Get the salts that the computer uses to add complexity to the hash function
	var salt = crypto.randomBytes(saltLength);

	// Invoke the pbkdf2 function and return the result via callback
	crypto.pbkdf2(password, salt, iterations, keyLength, function(error, hash) {
		return callback(salt, hash.toString('hex'));
	});
};

// Define the function that authenticates the user-pass combination
AccountSchema.statics.authenticate = function(username, password, callback) {
	// Try to find the account in question by username
	return AccountModel.findByUsername(username, function(error, doc){
		// If the error exists, a problem occurred, return the error
		if(error) {
			return callback(error);
		}

		// If the account does not exist, return the callback with no argument
		if(!doc){
			return callback();
		}

		// The account was found; validate the password here
		doc.validatePassword(password, function(result) {
			// If the result is successful, return the callback with the account included
			if(result === true) {
				return callback(null, doc);
			}

			// Otherwise, return an empty callback - validation failed
			return callback();
		});
	});
};

// Define the AccountModel with the given AccountSchema
AccountModel = mongoose.model('Account', AccountSchema);

// Add the model and schema to the exports of the module
module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;