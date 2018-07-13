/**
 * @fileOverview Define routes for the /posts identifier
 */

const express = require('express');     // Import express global library
const router = express.Router();        // Import the express router
const multer = require("multer");
const path = require('path');

/**
 * @description Load Database Models
 */
let Post = require("../models/post");   // Load Post model

/**
 * @description Set storage engine
 */
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage}).single('image');

/**
 *
 * Visibility: Public
 *
 * @description Ensures that the user sending a request is authenticated
 *
 * @param   {Object}    req
 * @param   {Object}    res
 * @param   {Object}    next
 *
 * @returns {*}
 */
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        req.flash('danger', 'Please login');
        res.status(401).redirect('/users/login');
    }
}

/**
 *
 * GET /posts
 *
 * Visibility: Private
 *
 * @description Renders add post page
 *
 * @param   {String}        Endpoint URL
 * @param   {Function}      Custom Authentication Function
 * @param   {Function}      Callback function for Request, Response objects
 */
router.get("/", ensureAuthenticated, (req, res) => {
    res.status(200).render('add_post', {
        title: "Add Post"
    });
});

/**
 *
 * POST /posts
 *
 * Visibility: Private
 *
 * @description Stores a new post in the database
 *
 * @param   {String}        Endpoint URL
 * @param   {Function}      Custom Authentication Function
 * @param   {Function}      Callback function for Request, Response objects
 */
router.post("/", ensureAuthenticated, (req, res) => {

    /**
     * @description Uploads form data along with the image filepath to the database
     *
     * @param   {Object}    req
     * @param   {Object}    res
     * @param   {Function}  err
     */
    upload(req, res, (err) => {
        if (err) {
            console.log('Upload error:', err);
        }
        // Add validation for form fields
        req.checkBody('title', 'Title is required').notEmpty();
        req.checkBody('description', 'Description is required').notEmpty();

        // Get errors from validator
        let errors = req.validationErrors();

        if (errors) {
            res.status(200).render('add_post', {
                title: 'Add Post',
                errors: errors
            });
        }
        else {
            let post = new Post();
            // Slice off the "./public/" part of the path since it is statically available
            let filepath = (req.file.destination + req.file.filename).slice(9);
            post.title = req.body.title;
            post.author = req.user.name;
            post.description = req.body.description;
            post.imagePath = filepath; // Store the uploaded image path in the database

            post.save((err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    // Adding a success message to the homepage
                    req.flash('success', 'Post added');
                    res.status(200).redirect('/');
                }
            });
        }
    });
});

/**
 *
 * GET /posts/:id
 *
 * Visibility: Private
 *
 * @description Renders edit post page
 *
 * @param   {String}        Endpoint URL
 * @param   {Function}      Custom Authentication Function
 * @param   {Function}      Callback function for Request, Response objects
 */
router.get("/:id", ensureAuthenticated, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            console.log(err);
        }
        else {
            if (post.author != req.user.name) {
                req.flash('danger', 'Not authorized');
                res.status(401).redirect('/');
            }
            else {
                res.status(200).render('edit_post', {
                    title: 'Edit Post',
                    post: post 
                });
                return;
            }            
        }        
    });
});

/**
 *
 * PUT /posts/:id
 *
 * Visibility: Private
 *
 * @description Edits an existing post and stores it in the database
 *
 * @param   {String}        Endpoint URL
 * @param   {Function}      Custom Authentication Function
 * @param   {Function}      Callback function for Request, Response objects
 */
router.put("/:id", ensureAuthenticated, (req, res) => {
    upload(req, res, (err) => {
        let post = {};
        // Slice off the "./public/" part of the path since it is statically available
        //let filepath = (req.file.destination + req.file.filename).slice(9);
        // post.title = req.body.title;
        // post.description = req.body.description;
        // post.imagePath = req.body.file;

        console.log(req.body[0]);

        // let query = {_id: req.params.id};
        //
        // Post.update(query, post, (err) => {
        //     if (err) {
        //         console.log(err);
        //     }
        //     else {
        //         // Adding a success message to the homepage
        //         req.flash('success', 'Post Updated');
        //         res.status(200).redirect(303, '/');
        //     }
        // });
    });
});

/**
 *
 * DELETE /posts/:id
 *
 * Visibility: Private
 *
 * @description Deletes a specified post in the database
 *
 * @param   {String}        Endpoint URL
 * @param   {Function}      Custom Authentication Function
 * @param   {Function}      Callback function for Request, Response objects
 */
router.delete('/:id', ensureAuthenticated, (req, res) => {
    if (!req.user._id) {
        res.status(500).send();
    }

    let query = {_id: req.params.id}

    Post.findById(req.params.id, (err, post) => {
        if (post.author !== req.user.name) {
            res.status(500).send();
        }
        else {
            Post.remove(query, (err) => {
                if (err) {
                    console.log(err);
                }
                req.flash('success', 'Post Deleted');
                res.status(200).redirect(303, '/');
            });
        }
    });    
});

module.exports = router; // Export the router