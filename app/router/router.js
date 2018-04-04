var express = require('express');
var auth = require('../middlewares/middleware');


var env = process.env.NODE_ENV || 'development';
var config = require('../config/config.json')[env];
var mailgun = require('mailgun-js')({apiKey: config.mailGunApiKey, domain: config.mailGunApiDomain});

var jwt = require('jsonwebtoken');

var routes = function (User,Task) {
    var router = express.Router();


    router.route('/').get(function (req, res) {
        res.send('Hello World!')
    });

    router.route('/register').post(function (req, res) {

        var user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            hasAcceptedTerms: req.body.hasAcceptedTerms
        });

        user.save(function (err) {
            if (err)
                return res.send(err);

            jwt.sign(user.email, config.jsonWebTokenSecret,function(err, token) {
                if (err)
                    return res.send(err);

                var data = {
                    from: config.adminEmailFrom,
                    to: user.email,
                    subject: 'Activate Account',
                    text: config.baseUrl+'/api/activate/'+token
                };

                mailgun.messages().send(data, function (error, body) {
                    console.log(body);
                    return res.json({message: 'User created!'});

                });
            });

        });

    });

    router.route('/authenticate').post(function (req, res) {

        User.findOne({email: req.body.email,isActive:true}, function (err, user) {
            if (err)
                res.send(err);

            if (!user) {
                res.json({success: false, message: 'Authentication failed.'});
            } else {
                user.isPasswordValid(req.body.password, function (err, isValid) {
                    if (err) throw err;

                    if (!isValid) {
                        res.json({success: false, message: 'Authentication failed.'});
                    } else {

                        jwt.sign(user.email, config.jsonWebTokenSecret,function(err, token) {
                            res.json({
                                success: true,
                                message: 'Authentication Successful',
                                token: token
                            });
                        });
                    }
                });
            }

        });

    });

    router.route('/password-reset').post(function (req, res) {
        // email with url and token
        // post with token and new password
        res.status(200).send('Hello');
    });

    router.route('/activate/:token').get(function (req, res) {

        jwt.verify(req.params.token, config.jsonWebTokenSecret, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {

                User.findOne({email: decoded}, function (err, user) {

                    if(user){
                        user.isActive = true;
                        user.save(function (err) {
                            if (err)
                                res.send(err);
                            return res.json({ success: true, message: 'User activated' });
                        });

                    }
                })
            }
        });
    });


    router.route('/tasks').get(auth.authToken,function (req, res) {

        Task.find({user: req.user.id}, function (err, tasks) {
            return res.json(tasks);
        });

    }).post(auth.authToken,function (req, res) {


        var task = new Task({
            title: req.body.title,
            user: req.user.id
        });

        task.save(function (err) {
            if (err)
                return res.send(err);

            return res.json({message: 'Task created!'});
        });


    });


    // tasks middleware
    router.use('/tasks/:id',auth.authToken,function (req, res, next) {

        Task.findById(req.params.id,function (err, task) {

            if(err) {
                res.status(500).send(err);
            }else if(task){

                req.task = task;
                next();

            }else{
                res.status(404).send('Not Found');
            }

        });

    });



    router.route('/tasks/:id').get(function (req, res) {
        return res.json(req.task);

    }).put(function (req,res) {

        req.task.title = req.body.title;
        req.task.isDone = req.body.isDone;
        req.task.save(function(err){
            if(err) {
                return res.status(500).send(err);
            }
            return res.status(201).json(req.task);
        });

    }).patch(function (req,res) {

        for(var key in req.body){
            // ignore _id
            if (key === '_id') { continue; }
            req.task[key] = req.body[key];
        }

        req.task.save(function(err){
            if(err) {
                res.status(500).send(err);
            }
            return res.status(201).json(req.task);
        });

    }).delete(function (req, res) {
        req.task.remove(function(err){
            if(err) {
                return res.status(500).send(err);
            }
            return res.status(204).send('Removed');
        });
    });

    return router;
}

module.exports = routes;
