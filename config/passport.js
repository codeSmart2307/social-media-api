/**
 * @fileOverview Initializes Passport authentication
 */

const LocalStrategy = require('passport-local').Strategy; // Import Passport Local Strategy Library
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    /**
     * @description Compares username and password stored in the database against entered credentials at login
     *
     * @param   {Object}    LocalStrategy
     */
    passport.use(new LocalStrategy((username, password, done) => { //Local Strategy
        // Queries database for username and compares it with the specified username in login
        let query = {username: username};
        User.findOne(query, (err, user) => {
            if (err) throw err;
            if (!user) {
                return done(null, false, {message: 'No user found with that username'});
            }

            // Decrypts the hashed password stored in the database and compares it with the specified 
            // password in login
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                // If the passwords match, the user object is passed to done()
                if (isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, {message: 'Password Invalid'});
                }
            });
        });
    }));

    /**
     * @description Determines which data of the user object should be saved in the session. Here the user id is saved
     *              to the session and later used to retrieve the entire user object in deserializeUser()
     *
     * @param   {Function}  Callback function which serializes user ID to the session
     */
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    /**
     * @description The key provided in the done() function of serializeUser() is matched with the database to retrieve
     *              the entire user object
     *
     * @param   {Function}  Callback function which deserializes user object from user ID stored in session
     */
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};