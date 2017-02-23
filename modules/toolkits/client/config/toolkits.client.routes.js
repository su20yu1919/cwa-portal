(function () {
  'use strict';

  angular
    .module('toolkits')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('toolkits', {
        abstract: true,
        url: '/toolkits',
        template: '<ui-view/>'
      })
      .state('toolkits.list', {
        url: '',
        templateUrl: 'modules/toolkits/client/views/list-toolkits.client.view.html',
        controller: 'ToolkitsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Toolkits List'
        }
      })
      .state('toolkits.create', {
        url: '/create',
        templateUrl: 'modules/toolkits/client/views/form-toolkit.client.view.html',
        controller: 'ToolkitsController',
        controllerAs: 'vm',
        resolve: {
          toolkitResolve: newToolkit
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Toolkits Create'
        }
      })
      .state('toolkits.edit', {
        url: '/:toolkitId/edit',
        templateUrl: 'modules/toolkits/client/views/form-toolkit.client.view.html',
        controller: 'ToolkitsController',
        controllerAs: 'vm',
        resolve: {
          toolkitResolve: getToolkit
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Toolkit {{ toolkitResolve.name }}'
        }
      })
      .state('toolkits.view', {
        url: '/:toolkitId',
        templateUrl: 'modules/toolkits/client/views/view-toolkit.client.view.html',
        controller: 'ToolkitsController',
        controllerAs: 'vm',
        resolve: {
          toolkitResolve: getToolkit
        },
        data: {
          pageTitle: 'Toolkit {{ toolkitResolve.name }}'
        }
      });
  }

  getToolkit.$inject = ['$stateParams', 'ToolkitsService'];

  function getToolkit($stateParams, ToolkitsService) {
    return ToolkitsService.get({
      toolkitId: $stateParams.toolkitId
    }).$promise;
  }

  newToolkit.$inject = ['ToolkitsService'];

  function newToolkit(ToolkitsService) {
    return new ToolkitsService();
  }
}());
