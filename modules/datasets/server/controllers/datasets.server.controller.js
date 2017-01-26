'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Dataset = mongoose.model('Dataset'),
  File = mongoose.model("File"),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Dataset
 */
exports.create = function(req, res) {
  var dataset = new Dataset(req.body);
  console.log(req.body);
  dataset.user = req.user;

  dataset.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dataset);
    }
  });
};

exports.create_file = function(input_file){
  var file = new File(input_file);
  console.log(input_file);
  file.save(function(err) {
    if (err) {
      console.log('Error in creating files in Backend');
    } else {
      console.log(file);
    }
  });
};
/**
 * Show the current Dataset
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var dataset = req.dataset ? req.dataset.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  dataset.isCurrentUserOwner = req.user && dataset.user && dataset.user._id.toString() === req.user._id.toString();
  dataset.isAdmin = req.user.roles.indexOf("admin") > -1;
  
  res.jsonp(dataset);
};

/**
 * Update a Dataset
 */
exports.update = function(req, res) {
  var dataset = req.dataset;

  dataset = _.extend(dataset, req.body);

  dataset.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dataset);
    }
  });
};

/**
 * Delete an Dataset
 */
exports.delete = function(req, res) {
  var dataset = req.dataset;

  dataset.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dataset);
    }
  });
};

/**
 * List of Datasets
 */
exports.list = function(req, res) {
  Dataset.find().sort('-created').populate('user', 'displayName').exec(function(err, datasets) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(datasets);
    }
  });
};

/**
 * Dataset middleware
 */
exports.datasetByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Dataset is invalid'
    });
  }

  Dataset.findById(id).populate('user', 'displayName').exec(function (err, dataset) {
    if (err) {
      return next(err);
    } else if (!dataset) {
      return res.status(404).send({
        message: 'No Dataset with that identifier has been found'
      });
    }
    req.dataset = dataset;
    next();
  });
};

/**
 * Get File
 */


