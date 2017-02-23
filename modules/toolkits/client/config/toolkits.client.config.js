(function () {
  'use strict';

  angular
    .module('toolkits')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Toolkits',
      state: 'toolkits',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'toolkits', {
      title: 'List Toolkits',
      state: 'toolkits.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'toolkits', {
      title: 'Create Toolkit',
      state: 'toolkits.create',
      roles: ['user']
    });
  }
}());
