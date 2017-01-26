(function () {
  'use strict';

  angular
    .module('datasets')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('datasets', {
        abstract: true,
        url: '/datasets',
        template: '<ui-view/>'
      })
      .state('datasets.list', {
        url: '',
        templateUrl: 'modules/datasets/client/views/list-datasets.client.view.html',
        controller: 'DatasetsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Datasets List'
        }
      })
      .state('datasets.create', {
        url: '/create',
        templateUrl: 'modules/datasets/client/views/form-dataset.client.view.html',
        controller: 'DatasetsController',
        controllerAs: 'vm',
        resolve: {
          datasetResolve: newDataset
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Datasets Create'
        }
      })
      .state('datasets.edit', {
        url: '/:datasetId/edit',
        templateUrl: 'modules/datasets/client/views/form-dataset.client.view.html',
        controller: 'DatasetsController',
        controllerAs: 'vm',
        resolve: {
          datasetResolve: getDataset
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Dataset {{ datasetResolve.name }}'
        }
      })
      .state('datasets.view', {
        url: '/:datasetId',
        templateUrl: 'modules/datasets/client/views/view-dataset.client.view.html',
        controller: 'DatasetsController',
        controllerAs: 'vm',
        resolve: {
          datasetResolve: getDataset
        },
        data: {
          pageTitle: 'Dataset {{ datasetResolve.name }}'
        }
      });
  }

  getDataset.$inject = ['$stateParams', 'DatasetsService'];

  function getDataset($stateParams, DatasetsService) {
    return DatasetsService.get({
      datasetId: $stateParams.datasetId
    }).$promise;
  }

  newDataset.$inject = ['DatasetsService'];

  function newDataset(DatasetsService) {
    return new DatasetsService();
  }
}());
