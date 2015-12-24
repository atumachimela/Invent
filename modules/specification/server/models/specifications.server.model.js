'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Specification Schema
 */
var SpecificationSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  specName: {
    type: String,
    default: '',
    trim: true,
    required: 'category cannot be blank'
  },
  color: {
    type: String,
     trim: true,
    required: 'color cannot be blank'
  },
  size: {
    type: Number,
    required: 'must have size'
  },
  stockInit: {
    type: Number,
    default: 0,
    required: 'cannot not be empty'
  },
  units: {
    type: String,
    required: 'must have unit in cartons or packets'
  },
  withdrawal: {
    type: Number
  },
  stockNow: {
    type: Number
  },
  item: {
    type: Schema.ObjectId,
    ref: 'Item'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Specification', SpecificationSchema);
