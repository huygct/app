'use strict';

/**
 *
 */
angular.module('musicApp')
  .directive('menuMusic', [function () {
    return {
      restrict: 'E', // should use 'A'
      templateUrl: 'scripts/main/menu-music.html'
    };
  }])
  .controller('mainController', ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {
    $scope.menus = {};
    $scope.menus.selectedMenu = 'Song';

    // catch event click link 'Home'
    //$scope.menus.isClickLinkHome = false;

    function start() {

    }

    // Hide menu side
    $scope.toggleSidenav = function (menuId) {
      $mdSidenav(menuId).toggle();
    };

    // set value for $scope.menus.selectedMenu when it was clicked
    $scope.setSelectedMenu = function (menuName) {
      $scope.menus.selectedMenu = menuName;
    };

    // click link 'home'
    $scope.clickLinkHome = function () {
      //console.log('click link home');
      location.reload();
      //$scope.menus.isClickLinkHome = true;
    };

    $scope.$on('$destroy', function () {
      console.log('scope destroy! main');
    });

    start();
  }])
;
