/**
 * Passport Authentication/Authorization Configuration
 */

// Module Dependencies
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy; // Other strategies to be included later
var People = mongoose.model('Person');

// Export
module.exports = function (passport) {

    'use strict';

    // Serialize sessions
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Deserialize sessions
    passport.deserializeUser(function (id, done) {

        People.findOne({_id: id}, 'avatar email name role language').exec(function (err, user) {
            done(err, user);
        });
    });

    //Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (username, password, done) {

            // Usernames (emails) are unique. Find person by email and select the hashed password
            People.findOne({ email: username }).exec(function (err, user) {

                // Simulate a server error
                // err = "Oh no! Server rot.";

                // Server error
                if (err) {
                    return done(err, false, { message: 'Server error: ' + err });
                }

                // User not found
                if (!user) {
                    return done(null, false, { message: 'That username does not exist.' });
                }

                // Incorrect Password
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'That is an incorrect password.' });
                }

                // Not confirmed
                if (!user.confirmed) {
                    var message = 'That email address has not been confirmed. ';
                    message += '<a href="#/resend/' + user._id + '">Resend email</a>';
                    return done(null, false, { message: message});
                }

                // OK, authenticated
                return done(null, user);
            });
        }
    ));
};