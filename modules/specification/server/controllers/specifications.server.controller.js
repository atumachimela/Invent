'use strict';

 /**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
  	Specification = mongoose.model('Specification'),
  	Item = mongoose.model('Item'),
  	_ = require('lodash'),
    nodemailer = require("nodemailer"),
 	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a a specification for an Item
 */
// exports.create = function(req, res) {
//   var spec = new Specification(req.body);
//   spec.user = req.user;
//   spec.item = req.item;
  
//   spec.save(function(err) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {

//       res.jsonp(spec);
//     }
//   });
// };

exports.create = function(req, res) {
  
   Specification.findOne({color: req.body.color}).exec(function(err, spec){
    console.log('found spec', spec);
    	
      if(spec){
       console.log('error');
        return res.status(400).send({
        message: 'Specification with that color already exist'
        });
      } else if(!spec){
      	console.log('user', req.user);
      	var specs = new Specification(req.body);
      	specs.user = req.user;
      	specs.item = req.item;
        specs.save(function(err) {
        if (err) {
          return res.status(400).send({
              message: 'unable to save specification'
          });
        } else {
          res.jsonp(specs);
        }
  });
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
  Specification.find().sort('-created').populate('user', 'displayName').populate('item', 'itemName').exec(function(err, specs) {
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
/***** make a withdrawal of a particular specification of an item*
withdraw from spec
 */

 exports.withdrawFromSpec = function(req, res){
 	
 var amountWithdrawn = req.body.withdrawal;
  console.log('withdrawal', amountWithdrawn);
  var currentSpec = req.params.specId;
  console.log('params', currentSpec);
  console.log('req', req.spec.stockInit);
  var stockInit = req.spec.stockInit;
  // subtract amountWithdwan from stockInit 
  var currentStock = stockInit - amountWithdrawn;
  console.log('current stock', currentStock);
  req.spec.stockInit = currentStock;
  req.spec.save(function(err){
  	if (err) {
          return res.status(400).send({
              message: 'unable to save withdrawal'
          });
        } else {
  			console.log('currentStock', req.spec);
          res.jsonp(req.spec);
        }
  });
  
 };

// function sendMail() {
	var transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    auth: {
	        user: 'proserviceinventory@gmail.com',
	        pass: '@regina123'
	    }
	});

	console.log('created');
// }

/** send email****/
function determineFunc(req, res) {
	Specification.find().exec(function(err, spec){
		if (err) {
      		return res.send({
        message: 'Noting found'
      		});
    	} else {
      		console.log('1', spec);
      		_.forEach(spec, function(specs, key){
		      console.log('2', specs.stockInit);
		      	if(specs.stockInit < 7 && specs.stockInit !== 0) {
		      		// sendMail();
		      		console.log('hh', specs.stockInit);
		      		var Message = {
		      		 	Name : specs.specName,
		      			Color : specs.color,
		      			Size : specs.size,
		      			Stock : specs.stockInit,
		      			Unit: specs.units
		      		};
		      		console.log('mess', Message);
		      		transporter.sendMail({
						from: 'proserviceinventory@gmail.com',
						to: 'proserviceinventory@gmail.com',
						subject: 'Re-Stock Alert',
						text:'Please' + '\t' + 'Re-stock' + '\t' + Message.Name + '\t' +'size' + ':' + '\t' + Message.Size + '\t' +'color' + ':'+ '\t' + Message.Color + '\t' + 'only' + '\t' + Message.Stock + ':' + '\t' + Message.Unit +'\t' + 'remaining'
					});
		      	}
		      		if (specs.stockInit === 0){
		      			var Message = {
		      				Name : specs.specName,
		      				Color : specs.color,
		      				Size : specs.size
		      			}
		      		transporter.sendMail({
						from: 'proserviceinventory@gmail.com',
						to: 'proserviceinventory@gmail.com',
						subject: 'Zero-Stock Alert',
						text:'Re-stock' + '\t' + 'immediately' + '\t' + Message.Name + '\t' +'size' + ':' +'\t' + Message.Size + '\t' +'color' + ':' + '\t' + Message.Color + '\t' + 'is' + '\t' + 'finished'
					});
		      	}
    		});

    	}
	});
}
determineFunc();


/*** create a function that states 

if currentStock is less than 50 send mail
if currentStock is less than 20 send mail
if currentStock is less than 10 send mail
if current stock is zero send mail 
***/


/**
 * specification middlewares
 */


exports.specByID = function(req, res, next, id) {
	if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Item specification is invalid'
    });
  }
  Specification.findById(req.params.specId).populate('user', 'displayName').populate('item', 'itemName').exec(function(err, spec) {
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
