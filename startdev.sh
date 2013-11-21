#!/bin/bash

clear # Clear the console
npm install # Run an npm install to get all dependencies
mongod --config ./server/config/mongod.conf & # Start a mongo DB server in the background (we don't care about its output)
grunt server
