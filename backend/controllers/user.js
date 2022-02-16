// Imports
const models = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Constants
const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/;

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
      return res.status(400).json({error:"password invalid (must length 4 - 8 and include 1 number at least)"});
    }
    
    models.User.findOne({ where: { email: req.body.email } })
      .then((result) => {
        if (result) {
          res.status(409).json({ message: "email already exist" });
        } else {
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (error, hash) {
              const user = {
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                bio: req.body.bio,
                imageUrl: req.file
                  ? `${req.protocol}://${req.get("host")}/images/${
                      req.file.filename
                    }`
                  : null,
                bgUrl: req.file
                  ? `${req.protocol}://${req.get("host")}/images/${
                      req.file.filename
                    }`
                  : null,
                password: hash,
                isAdmin: 0,
              };
              models.User.create(user)
                .then((result) => {
                  res.status(201).json({ message: "User created successfully" });
                })
                .catch((error) => {
                  res.status(500).json({ message: "something went wrong" });
                });
            });
          });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: "something went wrong !!!" });
      });
  },
  login: function login(req, res) {
    models.User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (user === null) {
          res.status(401).json({ message: "missing parameters" });
        } else {
          bcrypt.compare(
            req.body.password,
            user.password,
            function (err, result) {
              if (result) {
                jwt.sign(
                  {
                    email: user.email,
                    userId: user.id,
                  },
                  process.env.SECRET_TOKEN,
                  function (err, token) {
                    res.status(200).json({
                      user: user.id,
                      token: token,
                    });
                  }
                );
              } else {
                res.status(401).json({ message: "invalid credentials!" });
              }
            }
          );
        }
      })
      .catch((error) => {
        res.status(500).json({ message: "something went wrong ;)))" });
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
  getUserProfile: function (req, res) {
    const userId = req.params.id;
    models.User.findByPk(userId)
      .then(function (user) {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: "user not found" });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "cannot fetch user" });
      });
  },
  editUserProfile: function (req, res) {
    const userId = req.params.id;
    const updatedProfile = {
      bio: req.body.bio,
      imageUrl: req.file
        ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        : null,
    };

    models.User.update(updatedProfile, { where: { id: userId } })
      .then((result) => {
        res.status(200).json({
          message: "Profil updated successfully",
          post: updatedProfile,
        });
      })
      .catch((error) => {
        res.status(200).json({
          message: "Somenthing went wrong",
        });
      });
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
