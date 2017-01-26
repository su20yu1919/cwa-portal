(function () {
  'use strict';

  angular
    .module('datasets')
    .controller('DatasetsListController', DatasetsListController);

  DatasetsListController.$inject = ['DatasetsService'];

  function DatasetsListController(DatasetsService) {
    var vm = this;
    vm.sortType = 'name';
    vm.sortReverse = false;
    vm.searchDataset = '';
    vm.tagSelected = '';
    vm.searchCategory = [];
    vm.datasets = DatasetsService.query();

  }
}());
