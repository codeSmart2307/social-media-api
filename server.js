/**
 *
 * @fileOverview Lightweight REST API for a social media web application
 * @author Raneesh Gomez
 * @version 1.3.1
 *
 */

/**
 * @description Global Library Imports
 * @type {*|createApplication}
 */
const express = require("express");
const path = require('path');
const fs = require("fs");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const crypto = require("crypto");
const session = require("express-session");
const expressValidator = require("express-validator"); 
const flash = require("connect-flash");
const messages = require("express-messages");
const passport = require('passport');

/**
 * @description Local Resource Imports for the API
 */
const { mongoose } = require("./db/mongoose"); // Load database connection
const Post = require("./models/post"); // Load Post Model
const posts = require("./routes/posts"); // Load posts routes
const users = require('./routes/users'); // Load users routes


/**
 * @description Load environment variables
 */
require('dotenv').config();

/**
 * @description Initialize Express
 * @type {*|Function}
 */
const app = express();

/**
 * @description Load view engine and static assets
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug"); // Using the PUG template engine
app.use(express.static(path.join(__dirname, "public"))); // Load static assets


/**
 *
 * @description Load and Use Middleware
 *
 */
app.use(bodyParser.urlencoded({  // Create URL Encoded Body Parser
    extended: false
}));

app.use(bodyParser.json());      // Create Application/JSON Parser


app.use(morgan("dev", {          // Logs only 4xx and 5xx responses to console
    skip: function (req, res) { return res.statusCode < 400 }
}));
   

app.use(morgan("common", {       // Logs all requests to app.log in append mode
stream: fs.createWriteStream(path.join(__dirname, "app.log"), {flags: "a"})
}));

app.use(cors());                // Allows Cross Origin Resource Sharing

app.use((req, res, next) => {   // Enable CORS on the client side for our specific x-auth-key header
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-auth-key');
    res.header('Access-Control-Expose-Headers', 'x-auth-key');
    next();
});

app.use(session({               // Create express session middleware
    secret: "secretive secret",
    resave: true,               // Forces session to be saved back to the session store
    saveUninitialized: true     // Forces an uninitialized session to be saved to the store
                                // A session is unitialized when it is new but not modified
}));

app.use(flash());                   // Initialize Express Messages Middleware
app.use(function (req, res, next) { // Setting a global variable to the express-messages module
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.use(expressValidator({      // Express Validator Middleware
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }; 
    }
}));

require('./config/passport')(passport); // Passport config

app.use(passport.initialize());         // Initialize Passport middleware
app.use(passport.session());            // Initialize Passport Session



// app.use((req, res, next) => {        // All routes that follow this middleware is protected unless the key is sent in the custom header
//     const key = req.get('x-auth-key');
//     console.log('Key: ' + key);
//     if (!key || key !== process.env.API_KEY) {
//       res.render('login');
//     } else {
//       next();
//     }
// });


/**
 * @description Define routes
 */

/**
 *
 * GET /*
 *
 * @description Create global variable from Passport authenticated user object
 *
 * @param   {String}        Endpoint URL
 * @param   {Function}      Callback function for Request, Response objects and Next Middleware
 */
app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

/**
 *
 * GET /
 *
 * Visibility: Private
 *
 * @description Renders homepage
 *
 * @param   {String}        Endpoint URL
 * @param   {Function}      Callback function for Request, Response objects
 */
app.get("/", (req, res) => {
    Post.find({}, (err, posts) => {
        if (err) {
            console.log(err);
        }
        else {                     
            res.status(200).render('index', {
                title: "Welcome to LifePost",
                posts: posts
            });            
        }        
    });    
});

/**
 * @description Initialize imported routes
 */
app.use('/posts', posts); // Initialize posts routes
app.use('/users', users); // Initialize users routes

/**
 * @description 404 Route
 *
 * @param   {String}        Endpoint URL
 * @param   {Function}      Callback function for Request, Response objects
 */
app.get("*", (req, res) => {
    res.status(404).json({error: 'Page Not Found'});
});

/**
 * @description Starts the server
 */
app.listen(process.env.PORT || 7700, () => {
    console.log('Server up and running...');
});