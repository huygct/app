'use strict';
(function () {
  angular.module('musicApp')
    .controller('CheckboxRowController', ['animalService', function (animalService) {
      var ctrl = this;

      console.log('CheckboxRowController');

      // When select checkbox on row of table
      ctrl.toggleChecked = function (row) {
        console.log('clickCheckbox');
        animalService.toggleCheckedAnimal(row.id); //setCheckboxOfHeader();
      };
    }]);
})();