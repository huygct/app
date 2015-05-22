'use strict';

/**
 * @ngdoc function
 * @name musicApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the musicApp
 */
angular.module('musicApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
