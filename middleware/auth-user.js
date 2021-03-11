'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
    // store the message to display
    let message;
    //parse the user's credentials from the Authorization header.
    const credentials = auth(req);
    if (credentials) {
        const user = await User.findOne({ where: {emailAddress: credentials.name} });
        if (user) {
            const authenticated = bcrypt    
                .compareSync(credentials.pass, user.password);
            if (authenticated) {
                console.log(`Authentication successful for username: ${user.firstName} ${user.lastName}`);
                // Store the user on the Request object
                req.currentUser = user;
                res.locals.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.firstName} ${user.lastName}`;
            }
        } else {
            message = `User not found`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        res.status(401).json({ message: 'Access Denied '});
    } else {
        next();
    }
}
