// Imports
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var models = require('../models');

// Routes
module.exports = {
    register: function(req,res) {
        
        // Params
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;

        if (email == null || username == null || password == null) {
            return res.status(400).json({ 'error' : 'missing parameters' });
        }

        // TODO verify pseudo lengh, mail regex, password etc ...

        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
        .then(function(userFound) {
            if (!userFound) {

                bcrypt.hash(password, 10, function( err, bcryptedPassword ) {
                    var newUser = models.User.create({
                        email: email,
                        username: username,
                        password: bcryptedPassword,
                        isAdmin: 0
                      })
                      .then(function(newUser) {
                        return res.status(201).json ({
                            'userId': newUser.id
                        });
                      })
                      .catch(function(err) {
                        return res.status(500).json({ 'error': 'cannot add user' });
                      });
                });

            } else {
                return res.status(409).json({ 'error': 'user already exists' });
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verifyo user' });
        })

    },
    login: function(req,res) {
        
        // Params
        var email = req.body.email;
        var password = req.body.password;

        if (email ==null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        // TODO verify mail regex & password lengh.

        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
        .then(function(userFound) {

        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user'});
        })
    }
}