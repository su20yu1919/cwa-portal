// Toolkits service used to communicate Toolkits REST endpoints
(function () {
  'use strict';

  angular
    .module('toolkits')
    .factory('ToolkitsService', ToolkitsService);

  ToolkitsService.$inject = ['$resource'];

  function ToolkitsService($resource) {
    return $resource('api/toolkits/:toolkitId', {
      toolkitId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
