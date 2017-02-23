'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Toolkit = mongoose.model('Toolkit'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Toolkit
 */
exports.create = function(req, res) {
  var toolkit = new Toolkit(req.body);
  toolkit.user = req.user;

  toolkit.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(toolkit);
    }
  });
};

/**
 * Show the current Toolkit
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var toolkit = req.toolkit ? req.toolkit.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  toolkit.isCurrentUserOwner = req.user && toolkit.user && toolkit.user._id.toString() === req.user._id.toString();
  toolkit.isAdmin = req.user.roles.indexOf("admin") > -1;

  res.jsonp(toolkit);
};

/**
 * Update a Toolkit
 */
exports.update = function(req, res) {
  var toolkit = req.toolkit;

  toolkit = _.extend(toolkit, req.body);

  toolkit.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(toolkit);
    }
  });
};

/**
 * Delete an Toolkit
 */
exports.delete = function(req, res) {
  var toolkit = req.toolkit;

  toolkit.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(toolkit);
    }
  });
};

/**
 * List of Toolkits
 */
exports.list = function(req, res) {
  Toolkit.find().sort('-created').populate('user', 'displayName').exec(function(err, toolkits) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(toolkits);
    }
  });
};

/**
 * Toolkit middleware
 */
exports.toolkitByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Toolkit is invalid'
    });
  }

  Toolkit.findById(id).populate('user', 'displayName').exec(function (err, toolkit) {
    if (err) {
      return next(err);
    } else if (!toolkit) {
      return res.status(404).send({
        message: 'No Toolkit with that identifier has been found'
      });
    }
    req.toolkit = toolkit;
    next();
  });
};
