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
        db: 'mongodb://localhost/meanseed-dev',
        serverRoot: rootPath + '/server',
        clientRoot: rootPath + '/client',
        app: {
            name: 'MEAN Seed - Development'
        }
    },
    staging: {
        name: 'staging',
        db: '', // Your staging db connection string
        serverRoot: rootPath + '/server',
        clientRoot: rootPath + '/client',
        app: {
            name: 'MEAN Seed - Staging'
        }
    },
    production: {
        name: 'production',
        db: '', // Your production db connection string
        serverRoot: rootPath + '/server',
        clientRoot: rootPath + '/client',
        app: {
            name: 'MEAN Seed - Production'
        }
    }

};