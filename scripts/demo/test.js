'use strict';
(function () {
  angular.module('musicApp')
    .controller('TestController', ['$scope', 'animalService', function ($scope, animalService) {
      var self = this;

      var animalTableOptions = {};
      animalTableOptions.columnDefs =
        [
          {
            headerTemplateUrl: 'scripts/demo/templates/animal-table-checkbox-header.html',
            cellTemplateUrl: 'scripts/demo/templates/animal-table-checkbox-for-row.html'
          },
          {
            name: 'Name',
            key: 'name'
          },
          {
            name: 'Age',
            key: 'age'
          },
          {
            name: 'Action',
            cellTemplateUrl: 'scripts/demo/templates/animal-table-button.html'
          }
        ];

      animalTableOptions.data = [];

      animalTableOptions.externalScope = {
        //showAnimal: function (row) {
        //  console.log('---123---');
        //  console.log(row);
        //},
        //clickMarkAll: function () {
        //  self.markAll = !self.markAll;
        //  console.log(animalTableOptions);
        //  for(var i = 0; i < animalTableOptions.data.length; i++) {
        //    animalTableOptions.data[i].check = self.markAll;
        //  }
        //},
        //clickCheckbox: function (row) {
        //  console.log(row);
        //  setMarkAll(animalTableOptions.data);
        //},
        //markAll: self.markAll
      };

      // Check data to set value true or false for markAll
      //function setMarkAll(listData) {
      //  for (var i = 0; i < listData.length; i++) {
      //    if (listData[i].check === false) {
      //      self.markAll = false;
      //      return;
      //    }
      //  }
      //  self.markAll = true;
      //}

      //self.markAll = false;
      self.animalTableOptions = animalTableOptions;

      function getListAnimals() {
        animalService.getListAnimals()
          .then(function successCallback() {
            animalTableOptions.data = animalService.cache.animals;
            self.animalTableOptions = animalTableOptions;
          }, function errorCallback(result) {
            console.log('Fail to get songs' + result);
          });
      }

      
      //$scope.$watch('testCtrl.animalTableOptions.data', function (newValue) {
      //  console.log('have wath');
      //  console.log(newValue);
      //}, true);

      getListAnimals();
    }]);
})();
