// Imports
const models = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var asyncLib  = require('async');
require('dotenv').config();

// Constants
const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,12}$/;

// Routes
module.exports = {
  signup: function (req, res) {
   
    // Params
    let email = req.body.email;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let password = req.body.password;

    if (
      email == null ||
      firstname == null ||
      lastname == null ||
      password == null
    ) {
      return res.status(400).json({ error: "missing parameters" });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "email is not valid" });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({error:"password invalid (must length 4 - 12 and include 1 number at least)"});
    }
    
    asyncLib.waterfall([
      function(done) {
        models.User.findOne({
          attributes: ['email'],
          where: { email: email }
        })
        .then(function(result) {
          done(null, result);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(result, done) {
        if (!result) {
          bcrypt.hash(password, 15, function( err, bcryptedPassword ) {
            done(null, result, bcryptedPassword);
          });
        } else {
          return res.status(409).json({ 'error': 'user already exist' });
        }
      },
      function(result, bcryptedPassword, done) {
        var newUser = models.User.create({
          email: req.body.email,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          bio: req.body.bio,
          imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null,
          bgUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null,
          password: bcryptedPassword,
          isAdmin: 0
        })
        .then(function(newUser) {
          done(newUser);
        })
        .catch(function(err) {
          console.log(err);
          return res.status(500).json({ 'error': 'cannot add user' });
        });
      }
    ], function(newUser) {
      if (newUser) {
        return res.status(201).json({
          'userId': newUser.id
        });
      } else {
        console.log(err);
        return res.status(500).json({ 'error': 'cannot add user' });
      }
    });
  },
  login: function(req, res) {
    
    // Params
    var email    = req.body.email;
    var password = req.body.password;

    if (email == null ||  password == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    asyncLib.waterfall([
      function(done) {
        models.User.findOne({
          where: { email: email }
        })
        .then(function(userFound) {
          done(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, done) {
        if (userFound) {
          bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
            done(null, userFound, resBycrypt);
          });
        } else {
          return res.status(404).json({ 'error': 'user not exist in DB' });
        }
      },
      function(userFound, resBycrypt, done) {
        if(resBycrypt) {
          done(userFound);
        } else {
          return res.status(403).json({ 'error': 'invalid password' });
        }
      }
    ], function(userFound) {
      if (userFound) {
        return res.status(201).json({
          'userId': userFound.id,
          'token': process.env.SECRET_TOKEN,
        });
      } else {
        return res.status(500).json({ 'error': 'cannot log on user' });
      }
    });
  },
  getAllUsers: function (req, res) {
    models.User.findAll()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        res.status(500).json({
          message: "Something went wrong",
        });
      });
  },
  getUserProfile: function(req, res) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    if (userId < 0)
      return res.status(400).json({ 'error': 'wrong token' });

    models.User.findOne({
      attributes: [ 'id', 'email', 'username', 'bio', 'imageUrl', 'bgUrl' ],
      where: { id: userId }
    }).then(function(user) {
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    }).catch(function(err) {
      res.status(500).json({ 'error': 'cannot fetch user' });
    });
  },
  editUserProfile: function(req, res) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
    var bio       = req.body.bio;
    var imageUrl  = req.body.imageUrl;
    var role      = req.body.role;

    asyncLib.waterfall([
      function(done) {
        models.Users.findOne({
          attributes: ['id', 'bio','imageUrl', 'bgUrl'],
          where: { id: userId }
        }).then(function (userFound) {
          done(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, done) {
        if(userFound) {
          userFound.update({
            bio: (bio ? bio : userFound.bio),
            imageUrl: (imageUrl ? imageUrl : userFound.imageUrl),
            bgUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
          }).then(function() {
            done(userFound);
          }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot update user' });
          });
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      },
    ], function(userFound) {
      if (userFound) {
        return res.status(201).json(userFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update user profile' });
        }
      })
  },

  editUserOverlay: function (req, res) {
    const userId = req.params.id;
    const updatedProfile = {
      bgUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    };

    models.User.update(updatedProfile, { where: { id: userId } })
      .then((result) => {
        res.status(200).json({
          message: "Overlay updated successfully",
          post: updatedProfile,
        });
      })
      .catch((error) => {
        res.status(200).json({
          message: "Something went wrong",
          error: result,
        });
      });
  },
  deleteAccount: async function (req, res) {
    try {
      // Read
      const userId = req.body.userId;
      const idToDelete = req.params.id;
      if (!userId || !idToDelete) {
        res.status(401).json({ message: "request invalid" });
        return;
      }

      // Is authorized
      let allowed = req.body.isAdmin;
      if (userId == idToDelete) allowed = true;
      if (!allowed) {
        res.status(401).json({ message: "not allowed" });
        return;
      }

      // Destroy
      let user = await models.User.findOne({ where: { id: idToDelete } });
      user.destroy();
      res.status(200).json({ message: "compte supprimé", hooks: true });
    } catch (error) {
      res.status(400).json({ error });
    }
  },
};
