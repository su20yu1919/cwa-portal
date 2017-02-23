'use strict';

describe('Toolkits E2E Tests:', function () {
  describe('Test Toolkits page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/toolkits');
      expect(element.all(by.repeater('toolkit in toolkits')).count()).toEqual(0);
    });
  });
});
