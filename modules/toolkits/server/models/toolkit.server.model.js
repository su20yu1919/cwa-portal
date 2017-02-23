'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Toolkit Schema
 */
var ToolkitSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Toolkit name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  organization: {
    type: String,
    default: ""
  },
  weblink:{
    type: String,
    default: ""
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Toolkit', ToolkitSchema);
