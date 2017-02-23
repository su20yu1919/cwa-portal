(function () {
  'use strict';

  describe('Toolkits Route Tests', function () {
    // Initialize global variables
    var $scope,
      ToolkitsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ToolkitsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ToolkitsService = _ToolkitsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('toolkits');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/toolkits');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ToolkitsController,
          mockToolkit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('toolkits.view');
          $templateCache.put('modules/toolkits/client/views/view-toolkit.client.view.html', '');

          // create mock Toolkit
          mockToolkit = new ToolkitsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Toolkit Name'
          });

          // Initialize Controller
          ToolkitsController = $controller('ToolkitsController as vm', {
            $scope: $scope,
            toolkitResolve: mockToolkit
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:toolkitId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.toolkitResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            toolkitId: 1
          })).toEqual('/toolkits/1');
        }));

        it('should attach an Toolkit to the controller scope', function () {
          expect($scope.vm.toolkit._id).toBe(mockToolkit._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/toolkits/client/views/view-toolkit.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ToolkitsController,
          mockToolkit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('toolkits.create');
          $templateCache.put('modules/toolkits/client/views/form-toolkit.client.view.html', '');

          // create mock Toolkit
          mockToolkit = new ToolkitsService();

          // Initialize Controller
          ToolkitsController = $controller('ToolkitsController as vm', {
            $scope: $scope,
            toolkitResolve: mockToolkit
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.toolkitResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/toolkits/create');
        }));

        it('should attach an Toolkit to the controller scope', function () {
          expect($scope.vm.toolkit._id).toBe(mockToolkit._id);
          expect($scope.vm.toolkit._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/toolkits/client/views/form-toolkit.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ToolkitsController,
          mockToolkit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('toolkits.edit');
          $templateCache.put('modules/toolkits/client/views/form-toolkit.client.view.html', '');

          // create mock Toolkit
          mockToolkit = new ToolkitsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Toolkit Name'
          });

          // Initialize Controller
          ToolkitsController = $controller('ToolkitsController as vm', {
            $scope: $scope,
            toolkitResolve: mockToolkit
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:toolkitId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.toolkitResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            toolkitId: 1
          })).toEqual('/toolkits/1/edit');
        }));

        it('should attach an Toolkit to the controller scope', function () {
          expect($scope.vm.toolkit._id).toBe(mockToolkit._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/toolkits/client/views/form-toolkit.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
