var jwt = require('jsonwebtoken');
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config.json')[env];
var User = require('../models/user.model');

var middleware = function (){

    function authToken(req, res, next) {
        var token = req.body.token || req.query.token || req.token;
        if (token) {

            jwt.verify(token, config.jsonWebTokenSecret, function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // get email from decoded and add id and email to req.user
                    // should also check if active
                    User.findOne({ email: decoded}, function (err, user){
                        // doc is a Document
                        req.user = {user:user.email,id:user._id};
                        next();
                    });

                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    }

    return {authToken:authToken};


}

module.exports = middleware();
