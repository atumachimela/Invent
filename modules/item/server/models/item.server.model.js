'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ItemSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  itemName: {
    type: String,
    default: '',
    trim: true,
    required: 'Item name cannot be blank'
  },
  description: {
    type: Schema.ObjectId,
    ref: 'Description' 
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Item', ItemSchema);
