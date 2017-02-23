'use strict';

/**
 * Module dependencies
 */
var toolkitsPolicy = require('../policies/toolkits.server.policy'),
  toolkits = require('../controllers/toolkits.server.controller');

module.exports = function(app) {
  // Toolkits Routes
  app.route('/api/toolkits').all(toolkitsPolicy.isAllowed)
    .get(toolkits.list)
    .post(toolkits.create);

  app.route('/api/toolkits/:toolkitId').all(toolkitsPolicy.isAllowed)
    .get(toolkits.read)
    .put(toolkits.update)
    .delete(toolkits.delete);

  // Finish by binding the Toolkit middleware
  app.param('toolkitId', toolkits.toolkitByID);
};
