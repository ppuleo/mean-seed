/*
 * Person Model
 */

// Module dependencies
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the model
var personSchema = new Schema({
    //_id: auto-created
    email: String, // Email Address, username
    hashed_password: String, // Password
    confirmed: { type: Boolean, default: false }, // User has confirmed ownership of email address
    role: { type: String, default: 'user' }, // Access level: user|pro|admin
    remember: { type: Boolean, default: false }, // Remember this user using a cookie to bypass login
    avatar: [{}], // Array of avatars of mixed-type
    language: { type: String, default: 'English US' }, // User language
    name: {
        first: String, // First Name
        last: String // Last Name
    }
});

// Virtual Attributes
personSchema.virtual('name.full')
    .get(function () {
        'use strict';
        return this.name.first + ' ' + this.name.last;
    })
    .set(function (name) {
        'use strict';
        var split = name.split(' ');
        this.name.first = split[0];
        this.name.last = split[1];
    });

personSchema.virtual('password')
    .get(function () {
        'use strict';
        return this._password;
    })
    .set(function (password) {
        'use strict';
        this._password = password;
        this.hashed_password = bcrypt.hashSync(password, 10);
    });


personSchema.methods = {

    // Authentication
    validPassword: function (password) {
        'use strict';
        return bcrypt.compareSync(password, this.hashed_password);
    }
};

personSchema.set('toJSON', {
    virtuals: true
});


// Create the Person model
mongoose.model('Person', personSchema);