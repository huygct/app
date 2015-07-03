'use strict';
(function () {
  angular.module('musicApp')
    .controller('RowController', ['$scope', function ($scope) {

      console.log('RowContrller');

      var ctrl = this;
      ctrl.showAnimal = function (row) {
        console.log(row);
      };
    }]);
})();