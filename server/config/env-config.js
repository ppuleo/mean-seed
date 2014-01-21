/**
 * Environment Configuration
 */

// Module Dependencies
var path = require('path');

// Variables
var rootPath = path.normalize(__dirname + '/../..');

// Export
module.exports = {

    // The dev environment specifies a local mongoDB server. Replace the db and sessionStore properties
    // with your own remote mongoDB connection strings if desired.
    development: {
        name: 'development',
        db: {
            url: 'mongodb://localhost/meanseed-dev',
            options: {}
        },
        sessionStore: {
            url: 'mongodb://localhost/meanseed-dev',
            username: '',
            password: ''
        },
        serverRoot: rootPath + '/server',
        clientRoot: rootPath + '/client',
        app: {
            name: 'MEAN Seed - Development'
        }
    },
    staging: {
        db: {
            url: '', // Your staging db connection string
            options: {} // Your staging db options
        },
        sessionStore: {
            url: '', // Your staging session store connection string
            username: '', // Your staging session store username
            password: '' // Your staging session store password
        },
        serverRoot: rootPath + '/server',
        clientRoot: rootPath + '/client',
        app: {
            name: 'MEAN Seed - Staging'
        }
    },
    production: {
        db: {
            url: '', // Your production db connection string
            options: {} // Your production db options
        },
        sessionStore: {
            url: '', // Your production session store connection string
            username: '', // Your production session store username
            password: '' // Your production session store password
        },
        serverRoot: rootPath + '/server',
        clientRoot: rootPath + '/client',
        app: {
            name: 'MEAN Seed - Production'
        }
    }

};