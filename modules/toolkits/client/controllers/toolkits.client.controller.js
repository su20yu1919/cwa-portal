(function () {
  'use strict';

  // Toolkits controller
  angular
    .module('toolkits')
    .controller('ToolkitsController', ToolkitsController);

  ToolkitsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'toolkitResolve'];

  function ToolkitsController ($scope, $state, $window, Authentication, toolkit) {
    var vm = this;

    vm.authentication = Authentication;
    vm.toolkit = toolkit;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Toolkit
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.toolkit.$remove($state.go('toolkits.list'));
      }
    }

    // Save Toolkit
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.toolkitForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.toolkit._id) {
        vm.toolkit.$update(successCallback, errorCallback);
      } else {
        vm.toolkit.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('toolkits.view', {
          toolkitId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
