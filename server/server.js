/**
 * REST API Server
 * TODO: description, docs format
 */

// Module Dependencies
var express = require('express');
var fs = require('fs');
var passport = require('passport');

// Define the environment based on arguments passed in the server task
var env = process.env.NODE_ENV || 'development';
console.log('Environment is ' + env);

/**
 * Main Application Entry
 */

// Load configurations
var envConfig = require('./config/env-config')[env]; // dev, staging, prod, etc.
var auth = require('./config/authorization'); // auth middleware
var mongoose = require('mongoose'); // mongoose

// Bootstrap db connection
mongoose.connect(envConfig.db.url, envConfig.db.options, function (err) {

    if (err) {
        console.log('Database connection error: ' + err);
    }
    else {
        console.log('Databases connected successfully.');
    }
});

// Load models
var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
    require(modelsPath + '/' + file);
});

// If the dev environment is invoked, load some dummy data
if (env === 'development') {
    require('./data/dev-data')();
}

// Bootstrap the passport config
require('./config/passport-config')(passport);

// Create Express app
var app = express();

// Configure Express
require('./config/express-config')(app, envConfig, passport);

// Require the mail system
var mailer = require('./config/email-config');

// Bootstrap routes
require('./app/routes/static')(app, passport, envConfig, mailer);
require('./app/routes/people')(app, auth, mailer);
// Add more routes here...

// Init the app
var port = 9000;
app.listen(port);
console.log('App started on port ' + port + '. Waiting...');

// Expose App
module.exports = app;