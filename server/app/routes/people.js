/**
 * People REST API
 */

module.exports = function (app, auth, mailer) {

    'use strict';

    // Module dependencies
    var mongoose = require('mongoose');
    var People = mongoose.model('Person');

    /**
     * Gets all people. Security restrictions apply: users can only access limited information for
     * other accounts. Admins have full access.
     */
    app.get('/people', auth.requiresLogin, function (req, res) {

        // Construct a where clause if there are querystring parameters
        var query = {};

        if (!isEmpty(req.query)) {
            if (req.query.name.indexOf(' ') !== -1) {
                var split = req.query.name.split(' ');
                query = {
                    'name.first': new RegExp([split[0]], 'i'),
                    'name.last': new RegExp([split[1]], 'i')
                };
            }
            else {
                query = { $or: [
                    { 'name.first': new RegExp(req.query.name, 'i') },
                    { 'name.last': new RegExp(req.query.name, 'i') }
                ]};
            }

        }

        // Admins
        if (req.user.role === 'admin') {

            return People.find(query, 'name name.full avatar email role').exec(function (err, result) {

                // Successful query
                if (!err) {
                    return res.send(result); // Note: we consider null returns a success.
                }

                // Error
                else {
                    return res.send(500, {message: 'Server error: ' + err});
                }
            });
        }

        // Everyone else
        else {
            return People.find(query, 'name name.full avatar').populate(options).exec(function (err, result) {

                // Successful query
                if (!err) {
                    return res.send(result);
                }

                // Error
                else {
                    return res.send(500, {message: 'Server error: ' + err});
                }
            });
        }
    });


    /**
     * Gets one person by id. Security restrictions apply: users can only access the complete person
     * object for their own account. Admins have full access.
     */
    app.get('/people/:id', auth.requiresLogin, function (req, res) {

        return People.findById(req.params.id, 'name name.full avatar email role language').exec(function (err, result) {

            // Successful query
            if (!err) {

                if (result !== null) {

                    // Admin or self-lookup (only expose the complete person object to the owner or an admin)
                    if (result._id.toString() === req.user._id.toString() || req.user.role === 'admin') {

                        return res.send(result);
                    }

                    // Access denied
                    else {
                        return res.send(401, {message: 'Access error: Access denied. Your account does not have permission to access this person.'});
                    }
                }
                else {
                    res.send({});
                }
            }

            // Error
            else {
                return res.send(500, {message: 'Server error: ' + err});
            }
        });
    });


    /**
     * Creates a new person and sends a confirmation email.
     */
    app.post('/people', function (req, res) {

        // TODO: validate person object
        // Expect a valid person object in the request body
        var person = req.body;

        People.create(person, function (err, result) {
            if (!err) {

                var confirmUrl = 'http://' + req.headers.host + '/#/confirm/' + result._id;
                var confEmail = mailer.confEmail(confirmUrl);
                mailer.sendMail(result.email, confEmail.subject, confEmail.body);
                res.send({name: result.name});
            }
            else {
                return console.log(err);
            }
        });
    });


    /**
     * Removes a person by id.
     */
    app.delete('/people/:id', auth.requiresLogin, function (req, res) {

        // The person id is passed as the first param
        var id = req.params.id;

        // Admin or self-removal only
        if (id === req.user._id.toString() || req.user.role === 'admin') {

            People.findOneAndRemove({'_id': id}, function (err, result) {

                // Successful query
                if (!err) {
                    res.send(result);
                }

                // Error
                else {
                    return res.send(500, {message: 'Server error: ' + err});
                }
            });
        }

        // Access denied
        else {
            return res.send(401, {message: 'Access error: Access denied. Your account does not have permission to delete this person.'});
        }
    });


    /**
     * Updates selected person properties in a person object by id. Security restrictions apply:
     * users can only update themselves. Admins have full access.
     */
    app.put('/people/:id', auth.requiresLogin, function (req, res) {

        // Access granted as long as you're updating yourself or you're an admin
        if (req.params.id === req.user._id.toString() || req.user.role === 'admin') {

            var query = {_id: req.params.id};

            // Assume req.body contains a valid person object. Validation will be done by mongoose
            // in the model.
            var person = req.body;
            delete person._id; // Remove the _id if it is present, updates to _id are not allowed

            // Role (only admins can change roles)
            if (person.hasOwnProperty('role') && req.user.role !== 'admin') {
                delete person.role;
            }

            // Find the person and update.
            People.findOneAndUpdate(query, person).exec(function (err, result) {

                // Successful query
                if (!err) {
                    res.send(result);
                }

                // Error
                else {
                    res.send(500, {message: 'Server error: ' + err});
                }
            });
        }

        // Access denied
        else {
            return res.send(401, {message: 'Access error: Access denied. Your account does not have permission to update this person.'});
        }
    });


    /**
     * Checks whether an object is empty.
     * @param {Object} obj The object to check
     * @return {Boolean}
     */
    function isEmpty(obj) {

        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }

        return true;
    }
};