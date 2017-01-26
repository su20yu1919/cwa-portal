(function () {
  'use strict';

  angular
    .module('datasets')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Datasets',
      state: 'datasets',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'datasets', {
      title: 'List Datasets',
      state: 'datasets.list',
      roles: ['user']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'datasets', {
      title: 'Create Dataset',
      state: 'datasets.create',
      roles: ['admin']
    });
  }
}());
