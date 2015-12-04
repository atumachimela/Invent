'use strict';

/**
 * Module dependencies.
 */
var itemPolicy = require('../policies/item.server.policy'),
  items = require('../controllers/item.server.controller');

module.exports = function (app) {
  // Items collection routes
  app.route('/api/item').all(itemPolicy.isAllowed)
    .get(items.list)
    .post(items.create);

  // Single item routes
  app.route('/api/item/:itemId').all(itemPolicy.isAllowed)
    .get(items.read)
    .put(items.update)
    .delete(items.delete);

  // Finish by binding the item middleware
  app.param('itemId', items.itemByID);
};
