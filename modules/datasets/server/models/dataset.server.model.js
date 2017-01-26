'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var DatasetSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  weblink: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'N/A'
  },
  organization: {
    type: String,
    default: 'N/A'
  },
  documentations: {
    type: Object
  },
  documentations_filenames: {
    type: Array
  },
  filenames:{
    type: Array
  },
  category: {
    type: Object
  }

});


var FileSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  originalname: {
    type: String
  },
  filename: {
    type: String,
    default: '',
    trim: true
  }
  
});

mongoose.model('Dataset', DatasetSchema);
mongoose.model('File', FileSchema);
