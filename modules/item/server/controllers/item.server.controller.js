'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  // Specification = mongoose.model('Specification'),
  Item = mongoose.model('Item'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an item
 */
exports.create = function(req, res) {
  
   Item.findOne({itemName: req.body.itemName}).exec(function(err, item){
    console.log('found items', item);
    var item = new Item(req.body);
    item.user = req.user;
    // _.forEach(items, function(item, key){
    //   var itemName = req.body.itemName;
    //   console.log('req body', itemName);
    //   console.log('item in item', item.itemName);
      // if(itemName.toString() === item.itemName.toString()){
      if(item){
       console.log('error');
        return res.status(400).send({
        message: 'Item name exist'
        });
       // });
      } else{
        item.save(function(err) {
        if (err) {
          return res.status(400).send({
              message: 'unable to save Item Name'
          });
        } else {
          res.jsonp(item);
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
//  * List client proforma
//  */
// exports.clientProforma = function(req, res) {
//   console.log('client', req.client.id);
//   var clientId = req.client.id,
//     proformae = [];
//   Pinvoice.find().sort('-created').populate('user', 'displayName').exec(function(err, proformas) {
//         console.log('proformax', proformas);
//     if (err) {
//       return res.status(400).send({
//         message: 'No proforma found for client'
//       });
//     }
//     _.forEach(proformas, function(proforma, key) {
//       console.log('proforma', proforma);
//       if (proforma.client.toString() === clientId.toString()) {
//         console.log('proformas', proforma);
//         proformae.push(proforma);
//         console.log('proformae', proformae);
//       }
//     });
//       res.json(proformae);
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

// exports.clientProformaById = function(req, res, next) {
//   Client.findById(req.params.clientId).populate('user', 'displayName').exec(function(err, client) {
//     if (err) return next(err);
//     if (!client) return next(new Error('Failed to load proforma '));
//     req.client = client;
//     next();
//   });
// };
/**
 * item authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.item.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
