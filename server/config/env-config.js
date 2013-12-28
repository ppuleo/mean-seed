/**
 * Environment Configuration
 */

// Module Dependencies
var path = require('path');

// Variables
var rootPath = path.normalize(__dirname + '/../..');

// Export
module.exports = {
    development: {
        name: 'development',
        db: {
            url: 'mongodb://localhost/meanseed-dev',
            options: {}
        },
        sessionStore: {
            url: 'mongodb://localhost/meanseed-dev',
            options: {}
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
            options: {} // Your staging session store options
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
            options: {} // Your production session store options
        },
        serverRoot: rootPath + '/server',
        clientRoot: rootPath + '/client',
        app: {
            name: 'MEAN Seed - Production'
        }
    }

};