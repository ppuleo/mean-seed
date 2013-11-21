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
            'email': 'bilbo@theshire.me',
            'hashed_password': '$2a$10$ZDNNHNCY2liOe64L3Gi11uh06FiFMrgCeAFtzNbChNeFqPZxCzWBm',
            '_id': '5217dacfaba9e56d48000001',
            'role': 'admin',
            'language': 'English US',
            'name': {
                'first': 'Bilbo',
                'last': 'Baggins'
            },
            'avatar': []
        },
        {
            'confirmed': true,
            'email': 'frodo@theshire.me',
            'hashed_password': '$2a$10$ZDNNHNCY2liOe64L3Gi11uh06FiFMrgCeAFtzNbChNeFqPZxCzWBm',
            '_id': '5217dacfaba9e56d48000004',
            'role': 'admin',
            'language': 'English US',
            'name': {
                'first': 'Frodo',
                'last': 'Baggins'
            },
            'avatar': []
        },
        {
            'confirmed': true,
            'email': 'samwise@theshire.me',
            'hashed_password': '$2a$10$ZDNNHNCY2liOe64L3Gi11uh06FiFMrgCeAFtzNbChNeFqPZxCzWBm',
            '_id': '5217dacfaba9e56d48000003',
            'role': 'admin',
            'language': 'English US',
            'name': {
                'first': 'Sam',
                'last': 'Gamgee'
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

                // If the test user isn't found...
                else {

                    if (result === null) {
                        createUser(testPeople[index]);
                    }
                    else {
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