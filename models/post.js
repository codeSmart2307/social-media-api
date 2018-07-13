/**
 * @fileOverview Defines Post Schema and exports it
 */

const mongoose = require("mongoose");  // Import mongoose global library

/**
 * @description Define Post Schema
 */
const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: false
    }
});

let Post = mongoose.model('Post', postSchema); // Initialize Post Model

module.exports = Post;// Export the Post model