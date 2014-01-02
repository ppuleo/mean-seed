/**
 * Test Data
 */

// Module dependencies
var mongoose = require('mongoose');
var People = mongoose.model('Person');

module.exports = function () {

    'use strict';

    var testPeople = [
        {
            'confirmed': true,
            'email': 'jen@example.com',
            'hashed_password': '$2a$10$ZDNNHNCY2liOe64L3Gi11uh06FiFMrgCeAFtzNbChNeFqPZxCzWBm',
            '_id': '5217dacfaba9e56d48000001',
            'role': 'admin',
            'language': 'English US',
            'name': {
                'first': 'Jen',
                'last': 'Barber'
            },
            'avatar': []
        },
        {
            'confirmed': true,
            'email': 'moss@example.com',
            'hashed_password': '$2a$10$ZDNNHNCY2liOe64L3Gi11uh06FiFMrgCeAFtzNbChNeFqPZxCzWBm',
            '_id': '5217dacfaba9e56d48000004',
            'role': 'admin',
            'language': 'English US',
            'name': {
                'first': 'Maurice',
                'last': 'Moss'
            },
            'avatar': []
        },
        {
            'confirmed': true,
            'email': 'roy@example.com',
            'hashed_password': '$2a$10$ZDNNHNCY2liOe64L3Gi11uh06FiFMrgCeAFtzNbChNeFqPZxCzWBm',
            '_id': '5217dacfaba9e56d48000003',
            'role': 'admin',
            'language': 'English US',
            'name': {
                'first': 'Roy',
                'last': 'Trenneman'
            },
            'avatar': []
        }
    ];

    // Generic find user function
    function findUser(index) {

        People.findById(testPeople[index]._id, function (err, result) {

                if (err) {
                    console.log(err);
                }


                else {

                    if (result === null) { // If the test user isn't found...
                        createUser(testPeople[index]);
                    }
                    else { // Otherwise, recreate it
                        People.findOneAndRemove({'_id': result._id}, function (err, result) {
                            createUser(testPeople[index]);
                        });
                    }
                }
            });
    }

    // Generic user creation function
    function createUser(user) {

        People.create(user, function (err, result) {

            if (!err) {
                console.log('Created test user ' + result.email);

            }
            else {
                return console.log(err);
            }
        });
    }


    // Load the test data
    for (var i = 0; i < testPeople.length; i++) {

        // If the test users don't exist, create them
        (function (index) { findUser(index); })(i);
    }
};