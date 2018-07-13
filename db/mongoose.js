/**
 * @description Load environment variables
 */
require('dotenv').config();

const mongoose = require("mongoose"); // Import mongoose global library

let options = { // Use newUrlParser with MongoDB
    useNewUrlParser: true
};

// Using default global promises for mongoose promise
mongoose.Promise = global.Promise;

/**
 * @description Connect to MongoDB database (DaaS) on mLab
 */
mongoose.connect(process.env.MONGO_URI, options
).then(db => { // Success
    console.log("mLab Connection Established: ", db)
}).catch(e => { // Error
    console.log(e)
});

module.exports = { mongoose };