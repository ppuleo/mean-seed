/*
 * Reset Auth Model
 */

// Module dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the model
var resetAuthSchema = new Schema({
    //_id: auto-created
    email: String, // Email Address, username
    token: String, // Reset authorization token sent via email
    createdAt: { type: Date, default: Date.now(), expires: 1000 * 60 * 60 * 24 }
});


// Create the Reset model
mongoose.model('ResetAuth', resetAuthSchema);