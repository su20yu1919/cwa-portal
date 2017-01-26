// Datasets service used to communicate Datasets REST endpoints
(function () {
  'use strict';

  angular
    .module('datasets')
    .factory('DatasetsService', DatasetsService);

  DatasetsService.$inject = ['$resource'];

  function DatasetsService($resource) {
    return $resource('/api/datasets/:datasetId', {
      datasetId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

}());
