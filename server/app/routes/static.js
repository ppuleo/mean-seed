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
    var ResetAuth = mongoose.model('ResetAuth');
    var hat = require('hat');
    var rack = hat.rack(256, 16);

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

    /**
     * Forgot Password Route
     */
    app.post('/api/forgot', function (req, res, next) {

        // Find the person and update.
        People.findOne({email: req.body.email}, function (err, result) {

            // Successful query
            if (!err) {

                if (result !== null) {

                    // Create a reset auth key and email it to the user
                    var person = result;
                    var resetKey = rack();
                    var resetUrl = 'http://' + req.headers.host + '/#/reset?token=' + encodeURIComponent(resetKey);
                    var resetEmail = mailer.resetEmail(resetUrl);
                    mailer.sendMail(person.email, resetEmail.subject, resetEmail.body);

                    // Store the reset auth key
                    var resetEntry = {
                        email: req.body.email,
                        token: resetKey
                    };

                    ResetAuth.create(resetEntry, function (err, result) {

                        if (!err) {
                            res.send({name: person.name});
                        }

                        else {
                            res.send(500, {message: 'Server error: ' + err});
                        }
                    });

                }
                else {
                    res.send(401, {message: 'Account not found'});
                }
            }

            // Error
            else {
                res.send(500, {message: 'Server error: ' + err});
            }
        });
    });

    /**
     * Password Reset Get Route
     */
    app.get('/api/reset', function (req, res, next) {

        if (req.query.Keys === 0 || !req.query.token) {
            res.send(401, {message: 'Invalid password reset token.'});
        }

        else {
            ResetAuth.findOne({token: req.query.token}, function (err, result) {

                if (!err && result !== null) {
                    res.send({email: result.email});
                }

                else {
                    res.send(401, {message: 'Invalid password reset token.'});
                }
            });
        }
    });

    /**
     * Password Reset Post Route
     */
    app.post('/api/reset', function (req, res, next) {

        ResetAuth.findOne({token: req.body.token}, function (err, result) {

            if (!err && result !== null) {

                var token = result;

                People.findOneAndUpdate({email: token.email}, {password: req.body.password}).exec(function (err, result) {

                    if (!err) {

                        var person = result;
                        console.log(person);

                        ResetAuth.findOneAndRemove({'_id': token._id}, function (err, result) {

                            if (!err) {
                                res.send({name: person.name.full});
                            }

                            else {
                                res.send(500, {message: 'Server error: ' + err});
                            }
                        });

                    }

                    else {
                        res.send(500, {message: 'Server error: ' + err});
                    }
                });
            }

            else {
                res.send(401, {message: 'Invalid password reset token.'});
            }
        });

    });
};