// Imports
var models   = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');

// Constants
const TITLE_LIMIT   = 2;
const CONTENT_LIMIT = 4;
const ITEMS_LIMIT   = 50;

// Routes
module.exports = {
  createMessage: function(req, res) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);
    console.log(jwtUtils.getUserId);
    // Params
    var title   = req.body.title;
    var content = req.body.content;

    if (title == null || content == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
      function(done) {
        models.Users.findOne({
          where: { id: userId }
        })
        .then(function(userFound) {
          done(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, done) {
        if(userFound) {
          models.Messages.create({
            title  : title,
            content: content,
            attachment: 0,
            likes  : 0,
            userId : userFound.id
          })
          .then(function(newMessage) {
            done(newMessage);
          });
          console.log(userFound.id);
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      },
    ], function(newMessage) {
      if (newMessage) {
        return res.status(201).json(newMessage);
      } else {
        return res.status(500).json({ 'error': 'cannot post message' });
      }
    });
  },
  listMessages: function(req, res) {
    var fields  = req.query.fields;             // Permet de recup les colonnes que l'on souhaite afficher
    var limit   = parseInt(req.query.limit);    // Permet de recup les messages par segmentation
    var offset  = parseInt(req.query.offset);   // "    "    "    "   "
    var order   = req.query.order;              // Permet de recup la liste des messages dans un ordre particulier

    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    models.Messages.findAll({
      order: [(order != null) ? order.split(':') : ['title', 'ASC']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      limit: (!isNaN(limit)) ? limit : null,
      offset: (!isNaN(offset)) ? offset : null,
      include: [{
        model: models.Users,
        attributes: [ 'username' ]
      }]
    }).then(function(messages) {
      if (messages) {
        res.status(200).json(messages);
      } else {
        res.status(404).json({ "error": "no messages found" });
      }
    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ "error": "invalid fields" });
    });
  }
}