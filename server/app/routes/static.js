/**
 * Static Routes
 */

module.exports = function (app, passport, envConfig, mailer) {

    'use strict';
    // Any additional static routes can be defined here.
    // The main static route, '/', is defined in express-config.js

    // Module dependencies
    var mongoose = require('mongoose');
    var People = mongoose.model('Person');

    /**
     * Base route
     */
    app.get('/', function (req, res, next) {

        var user = {
            authenticated: req.isAuthenticated()
        };

        if (typeof(req.user) !== 'undefined') {
            user._id = req.user._id;
            user.name = {
                first: req.user.name.first,
                last: req.user.name.last,
                full: req.user.name.first + ' ' + req.user.name.last
            }
            user.email = req.user.email;
            user.avatar = req.user.avatar;
            user.role = req.user.role;
        }

        // Render the index (default) file with ejs. Pass in the enviroment variable and the req user.
        res.render(envConfig.clientRoot + '/index', {
            env: envConfig.name,
            user: user
        });
    });


    /**
     * Login route
     */
    app.post('/login', function (req, res, next) {

        // Default: use the localStrategy in passport-config.js
        passport.authenticate('local', function (err, user, info) {

            // Server Error
            if (err) { return res.send(500, info.message); }

            // Unknown User
            if (!user) { return res.send(401, info.message); }

            // User found, try logging in
            req.logIn(user, function (err) {

                if (err) {

                    return next('Login error: Passport error: ' + err);
                }

                return res.send(req.user);
            });
        })(req, res, next);
    });


    /**
     * Logout route
     */
    app.get('/logout', function (req, res) {

        // Call the passport logout function
        req.logOut();

        res.send(200, {message: 'You are now logged out.'});
    });


    /**
     * Confirm email route
     */
    app.get('/confirm/:id', function (req, res) {

        // Find the person and update.
        People.findOneAndUpdate({_id: req.params.id}, {confirmed: true}, function (err, result) {

            // Successful query
            if (!err) {

                if (result !== null && result.confirmed) {
                    res.send({name: result.name});
                }
                else {
                    res.send({});
                }
            }

            // Error
            else {
                res.send(500, {message: 'Server error: ' + err});
            }
        });
    });


    /**
     * Resend confirmation email route
     */
    app.get('/resend/:id', function (req, res) {

        // Find the person and update.
        People.findOne({_id: req.params.id}, function (err, result) {

            // Successful query
            if (!err) {

                if (result !== null && !result.confirmed) {

                    var resetUrl = 'http://' + req.headers.host + '/#/confirm/' + result._id;
                    var confEmail = mailer.confEmail(resetUrl);
                    mailer.sendMail(result.email, confEmail.subject, confEmail.body);
                    res.send({name: result.name});
                }
                else {
                    res.send({});
                }
            }

            // Error
            else {
                res.send(500, {message: 'Server error: ' + err});
            }
        });
    });

};