'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  // Specification = mongoose.model('Specification'),
  Item = mongoose.model('Item'),
  Specification = mongoose.model('Specification'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an item
 */
exports.create = function(req, res) {
  
 Item.findOne({itemName: req.body.itemName}).exec(function(err, item){
  console.log('found items', item);
    if(item){
     console.log('error');
      return res.status(400).send({
      message: 'Item name exist'
      });
    } else{
      var items = new Item(req.body);
      items.user = req.user;
        items.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: 'unable to save Item Name'
            });
          } else {
              res.jsonp(items);
            }
        });
      }
  }); 
};
  
/**
 * Show the current item
 */
exports.read = function(req, res) {
  res.jsonp(req.item);
};

/**
 * Update a item
 */
exports.update = function(req, res) {
  var item = req.item;

  item = _.extend(item, req.body);

  item.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(item);
    }
  });
};

/**
 * Delete an item
 */
exports.delete = function(req, res) {
  var item = req.item;

  item.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(item);
    }
  });
};

/**
 * List of items
 */
exports.list = function(req, res) {
  Item.find().sort('-created').populate('user', 'displayName').exec(function(err, item) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(item);
    }
  });
};

/**
Get all specification of an Item*
**/
// exports.list = function(req, res) {
//   Item.findOne({item: req.body.itemName}).sort('created').populate('user', 'displayName').exec(function(err, item){
//       Specification.find({}).sort('-created').populate('user', 'displayName').exec(function(err, specs) {

//   });
//   Specification.find().sort('-created').populate('user', 'displayName').exec(function(err, specs) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.jsonp(specs);
//     }
//   });
// };
/**



Get a specification of an Item
**/


/***
list all latest additions to the Item DB
**/

// exports.listLatestItems = function(res, req){

//   Item.find().sort('-created').populate('user', 'displayName').exec(function(err, items){
//      latestItem = (items.created <= 
//     if(err){
//       return res.status(400).send({
//         message: 'New latest Item in stock'
//       });
//     }

//   });
// };
/**
 * item middlewares
 */

exports.itemByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Item is invalid'
    });
  }
  Item.findById(req.params.itemId).populate('user', 'displayName')
  .exec(function (err, item) {
    if (err) return next(err);
    if (!item) {
      return res.status(404).send({
        message: 'No item with that identifier has been found' 
      });
    }
    req.item = item;
    next();
  });
};

 /* item authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.item.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
