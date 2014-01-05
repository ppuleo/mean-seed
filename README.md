# MEAN Seed Project

A __single page app__ seed project for building RESTful apps with node, mongo, express, and angular

## Demo
[http://ppuleo-mean-seed.jit.su](http://ppuleo-mean-seed.jit.su)

## Features
* Built on Foundation with responsive templates
* True Single Page App with configurable page transitions/animations
* User account signup flow with email confirmation
* Password reset flow using one-time email tokens
* Simple admin interface for account management
* Authentication with cookie-based login sessions, 'remember me' option for long sessions
* Expandable authorization system using page and route-level role checking
* Easy integration with hosted mongoDB services

## How to Use
As a seed project, the MEAN Seed application should be easy to set up and modify. Start by making sure you have the prerequisites installed then clone or download the project, enter a few configuration options, and launch the dev environment.

### Prerequisites
The MEAN Seed depends on a few well-known technologies. Install these first.
* [node.js](http://nodejs.org) - Install node.js
* [Grunt](http://gruntjs.com/getting-started) - Install the Grunt task runner CLI
* [SASS](http://sass-lang.com/install) - Install SASS (you may also need to install or upgrade [Ruby](https://www.ruby-lang.org/en/downloads))
* [git](http://git-scm.com) - (Optional) Your MEAN Seed project will be easier to manage if it's version controlled with git
* [mongoDB](http://www.mongodb.org) - (Optional) To run the project locally, you'll need a local mongoDB instance. Alternately, you can set up a hosted instance (with a provider like [MongoHQ](http://www.mongohq.com/home)) and configure the local environment to use that instead.

### Configuration
The MEAN seed project needs a few configuration options set before it will run. Configuration files are found in the /server/config/ folder.

* __Environments (env-config.js)__ - Like many node.js apps, the project uses an environment variable named `NODE_ENV` to specify the application's run mode. The MEAN Seed uses the typical _development_, _staging_, and _production_ environments but you can also add your own.
    1. Specify your desired database and session store connection strings for each environment.
    2. Set your app name.
    3. Set the web root paths for the client and server app (if you change the default locations).
* __Email (email-config.js)__ - Email is used for new account confirmations and password resets.
    1. Set up your desired email service credentials.
    2. Update the email sender, subject, and body text as desired.
* __Sessions (express-config.js)__ - The MEAN Seed uses cookie-based login sessions for authentication. You can set the session cookie name and secret here.

### Testing Data
To expedite testing, the MEAN Seed includes some test user data that can be populated each time the app loads in the development environment. You can customize this data in the /server/data/dev-data.js file.

### Start the Dev Environment
The MEAN seed application is self-contained. The REST service and the client app are both run from a simple node server. In local development, the node server listens on localhost:9000. To start the application in a local dev environment, simply run the command:

    ./startdev.sh

## Credits
The MEAN Seed was developed by Phil Puleo, [Filip Adamczyk](https://github.com/filbot), and [Ericson de Jesus](https://github.com/ericsond).