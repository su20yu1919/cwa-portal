(function () {
  'use strict';

  // Datasets controller
  
  angular
    .module('datasets')
    .controller('DatasetsController', DatasetsController);

  DatasetsController.$inject = ['$scope', '$state', '$http', '$window', 'Authentication', 'Upload', 'datasetResolve'];

  function DatasetsController ($scope, $state, $http, $window, Authentication, Upload, dataset) {
    var vm = this;
    var upload_result;
    vm.authentication = Authentication;
    vm.dataset = dataset;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    // vm.download = function(filename) {
    //   var form = document.createElement("form");
    //   form.setAttribute("action", "./upload");
    //   form.setAttribute("method", "get");
    //   form.setAttribute("target", "_blank");
    //
    //   var hiddenEle1 = document.createElement("input");
    //   hiddenEle1.setAttribute("type", "hidden");
    //   hiddenEle1.setAttribute("name", "some");
    //   hiddenEle1.setAttribute("value", value);
    //
    //   form.append(hiddenEle1 );
    //
    //   form.submit();
    // };

    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        for (var j = 0, length = vm.dataset.filenames.length; j < length; j++) {
          $http.delete("/api/delete_file?filename=" + vm.dataset.filenames[j]);
        }
        
        for (var i = 0, len = vm.dataset.documentations_filenames.length; i < len; i++) {
          $http.delete("/api/delete_file?filename=" + vm.dataset.documentations_filenames[i]);
        }
        vm.dataset.$remove($state.go('datasets.list'));
      }
    }

    // Upload function for files
    vm.upload = function (files) {
      if (files && files.length) {
        Upload.upload({
          url: '/api/uploads',
          arrayKey: '',
          data: {
            files: files
          }
        }).then(function (resp) {
          if (resp.status !== 200) {
            $scope.errorMsg = resp.status + ': ' + resp.data;
          }
          upload_result = resp.data;

        }, function (evt) {
          $scope.progress =
            Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
      }
    };
    

    // Save Dataset, remember this upload is also async, so you need to assign all variables here. 
    function save(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.datasetForm');
        return false;
      }
      vm.upload(vm.dataset.files);
      vm.dataset.filenames = [];
      for (var i = 0, len = vm.dataset.files.length; i < len; i++){
        vm.dataset.filenames[i] = vm.dataset.files[i].name;
      }
      vm.upload(vm.dataset.documentations);
      vm.dataset.documentations_filenames = [];
      for (var j = 0, length = vm.dataset.documentations.length; j < length; j++){
        vm.dataset.documentations_filenames[j] = vm.dataset.documentations[j].name;
      }
      delete vm.dataset.files;
      delete vm.dataset.documentations;

      // console.log(vm.dataset.files);


      // TODO: move create/update logic to service
      if (vm.dataset._id) {
        vm.dataset.$update(successCallback, errorCallback);
      } else {
        vm.dataset.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('datasets.view', {
          datasetId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
