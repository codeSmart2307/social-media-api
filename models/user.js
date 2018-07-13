/**
 * @fileOverview Defines Post Schema and exports it
 */

const mongoose = require("mongoose");  // Import mongoose global library

/**
 * @description Define User Schema
 */
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});

let User = mongoose.model('User', userSchema); // Initialize User model

module.exports = User; // Exports the User model