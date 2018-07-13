/**
 * @fileOverview Define routes for the /users identifier
 */

const express = require('express');     // Import express global library
const router = express.Router();        // Import the express router
const bcrypt = require('bcryptjs');     // Import bcryptjs, a hashing library for passwords
const passport = require('passport');   // Import PassportJS, a custom authentication library for users

/**
 * @description Load Database Models
 */
let User = require('../models/user');   // Load User Model

/**
 *
 * GET /users/register
 *
 * Visibility: Public
 *
 * @description Renders register page
 *
 * @param   {String}        Endpoint URL
 * @param   {Function}      Callback function for Request, Response objects
 */
router.get('/register', (req, res) => {
    res.status(200).render('register');
});

/**
 *
 * POST /users/register
 *
 * Visibility: Public
 *
 * @description Stores a new user in the database
 *
 * @param   {String}        Endpoint URL
 * @param   {Function}      Callback function for Request, Response objects
 */
router.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    // Add validation for registration form fields
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password should be at least 6 characters').len(6);
    req.checkBody('password2', 'Passwords do not match').equals(password);

    // Get errors from validator
    let errors = req.validationErrors();

    // If errors exist, re-render the registration page and pass the errors to it
    if (errors) {
        res.status(200).render('register', {
            errors: errors
        });
    }
    else {
        // Create a new User document
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        // Generate a salt asynchronously with a work factor of 10
        // Work factor is the number of rounds(cycles) the data is processed
        // Bigger the work factor, the more secure the password but the more time it takes
        bcrypt.genSalt(10, (err, salt) => {
            // Hash the password combining with the salt asynchronously
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    console.log(err);
                }
                // Assign the hash to the password key being saved to the database
                newUser.password = hash;
                newUser.save((err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    else {
                        // Add a success message to the login screen after redirecting
                        req.flash('success', 'You have been registered successfully');
                        res.status(200).redirect('/users/login');
                    }
                });
            });
        });
    }
});

/**
 *
 * GET /users/login
 *
 * Visibility: Public
 *
 * @description Renders login page
 *
 * @param   {String}        Endpoint URL
 * @param   {Function}      Callback function for Request, Response objects
 */
router.get('/login', (req, res) => {
    res.status(200).render('login');
});

/**
 *
 * POST /users/login
 *
 * Visibility: Public
 *
 * @description Authenticates existing user in the database and adds them to the passport session
 *
 * @param   {String}        Endpoint URL
 * @param   {Function}      Callback function for Request, Response objects
 */
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true,
        successFlash: 'Welcome!'
    })(req, res, next);
});

/**
 *
 * GET /users/logout
 *
 * Visibility: Public
 *
 * @description Logs authenticated user out of the passport session
 *
 * @param   {String}        Endpoint URL
 * @param   {Function}      Callback function for Request, Response objects
 */
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You have been logged out');
    res.status(200).redirect('/users/login');
});

module.exports = router; // Export the router