'use strict';

 /**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
  	Specification = mongoose.model('Specification'),
  	Item = mongoose.model('Item'),
  	_ = require('lodash'),
 	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a a specification for an Item
 */
exports.create = function(req, res) {
  var spec = new Specification(req.body);
  spec.user = req.user;
  spec.item = req.item;
  
  spec.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.jsonp(spec);
    }
  });
};

/**
 * Show the current specification
 */
exports.read = function(req, res) {
  res.jsonp(req.spec);
};

/**
 * Update a specification
 */
exports.update = function(req, res) {
  var spec = req.spec;

  spec = _.extend(spec, req.body);

  spec.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(spec);
    }
  });
};

/**
 * Delete a specification
 */
exports.delete = function(req, res) {
  var spec = req.spec;

  spec.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(spec);
    }
  });
};

/**
 * List of Specifications for the user
 */
exports.list = function(req, res) {
  Specification.find().sort('-created').populate('user', 'displayName').exec(function(err, specs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(specs);
    }
  });
};

/**
 * List all specifications for an item
 */
// exports.itemSpec = function(req, res) {
//   console.log('item', req.item.id);
//   var itemId = req.item.id,
//     specs = [];
//   Item.find().sort('-created').populate('user', 'displayName').exec(function(err, item) {
//         console.log('myItem', item);
//     if (err) {
//       return res.status(400).send({
//         message: 'No Item found'
//       });
//     }
//     _.forEach(item, function(specs, key) {
//       console.log('specifications', specs);
//       if (item.spec.toString() === itemId.toString()) {
//         console.log('specification', spec);
//         specs.push(spec);
//         console.log('specifications2', specs);
//       }
//     });
//       res.json(specs);
//   });
// };

/**
 * List one specifications for an item
 */


/**
 * specification middlewares
 */

 // exports.uniqueItemName = function(req, res, next){
 //   var specName = req.body.specName;
 //   Item.find({item: req.item}).exec(function(err, item){
 //    console.log('item', item);
 //    _.forEach(specs, function(spec, key){
 //      if(specName === item.specName){
 //        console.log('error');
 //          return res.status(403).send({
 //            message: 'Specification Name Exist'
 //          });
 //      }
 //    });
 //   });
 //   next();

 // };

exports.specByID = function(req, res, next, id) {
	if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Item specification is invalid'
    });
  }
  Specification.findById(req.params.specId).populate('user', 'displayName').exec(function(err, spec) {
    if (err) return next(err);
    if (!spec) {
      return res.status(404).send({
        message: 'No item  specification with that identifier has been found' 
      });
    }
    req.spec = spec;
    next();
  });
};

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
/**
 * specification authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.spec.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
