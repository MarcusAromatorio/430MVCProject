/*
* This script hooks up the controllers to the module that require(controllers) returns upon invocation
* index.js is the default script that is executed when a directory is passed as the argument
*/

module.exports.Account = require('./Account.js');
module.exports.CatCall = require('./Call.js');