'use strict';
(function () {
  angular.module('musicApp')
    .controller('CheckboxHeaderController', ['animalService', function (animalService) {
      var ctrl = this;

      console.log('CheckboxHeaderController');

      ctrl.animalService = animalService;

      // click checkbox all on header table
      ctrl.clickMarkAll = function () {
        animalService.setCheckAllAnimals(ctrl.animalService.cache.checkedAll);
      };
    }]);
})();