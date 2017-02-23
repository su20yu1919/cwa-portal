(function () {
  'use strict';

  angular
    .module('toolkits')
    .controller('ToolkitsListController', ToolkitsListController);

  ToolkitsListController.$inject = ['ToolkitsService'];

  function ToolkitsListController(ToolkitsService) {
    var vm = this;

    vm.toolkits = ToolkitsService.query();
    vm.searchDataset = '';
  }
}());
