'use strict';

/**
 * Module dependencies.
 */
var specificationsPolicy = require('../policies/specifications.server.policy'),
    specifications = require('../controllers/specifications.server.controller');  
    // items = require('../controllers/item.server.controller');


module.exports = function (app) {
  // Specification collection routes
  app.route('/api/item/:itemId/spec').all(specificationsPolicy.isAllowed)
    .get(specifications.list)
    .post(specifications.create);

  // Single specification routes
  app.route('/api/item/:itemId/spec/:specId').all(specificationsPolicy.isAllowed)
    .get(specifications.read)
    .put(specifications.update)
    .post(specifications.withdrawFromSpec)
    .delete(specifications.delete);

  // Finish by binding the specification and item middleware
  app.param('specId', specifications.specByID);
  app.param('itemId', specifications.itemByID);

};  



