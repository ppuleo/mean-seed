/**
 * Express Configuration
 */

// Module Dependencies
var express = require('express');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(express);

// Export
module.exports = function (app, envConfig, passport) {

    'use strict';

    // Show stack errors
    app.set('showStackError', true);

    // Should be placed before express.static
    // Compress response data with gzip/deflate
    app.use(express.compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // Use a custom favicon
    //app.use(express.favicon(__dirname + '/web/assets/favicon.ico'));

    //Enable jsonp
    app.enable('jsonp callback');

    app.configure(function () {

        // Express app configuration
        app.use(express.cookieParser()); //cookieParser should be above session
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());

        // Set up our session and session cookie, store the session for scalability
        app.use(express.session({
            key: 'mean.sid', // TODO: Add your desired key here
            cookie: {path: '/', httpOnly: true, maxAge: null},
            store: new MongoStore(envConfig.sessionStore),
            secret: 'spicy lamb vindaloo' // TODO: Add your desired secret here
        }));

        app.use(flash());  //connect flash for flash messages

        app.use(passport.initialize());
        app.use(passport.session());

        app.use(app.router);

        app.set('view engine', 'ejs'); // Use ejs template engine instead of jade
        app.engine('.html', require('ejs').__express);
        app.set('views', envConfig.clientRoot);

        // Serve the public site from the web root folder
        app.use(express.static(envConfig.clientRoot));


        //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

};