'use strict';

/**
 * main controller for web music manager
 */

(function () {
  function menuMusic() {
    return {
      restrict: 'E', // should use 'A'
      templateUrl: 'scripts/main/templates/menu-music.html'
    };
  }

  function mainController ($scope, $mdSidenav, $i18next) {

    $i18next.options.lng = 'en';
    $scope.languageWeb = 'en';

    $scope.menus = {};
    $scope.menus.selectedMenu = 'Songs';
    $scope.menus.nameCurrentMenu = $i18next('menu.songs');
    // catch event click link 'Home'
    //$scope.menus.isClickLinkHome = false;

    // Hide menu side
    $scope.toggleSidenav = function (menuId) {
      $mdSidenav(menuId).toggle();
    };

    // set value for $scope.menus.selectedMenu when it was clicked
    $scope.setSelectedMenu = function (key) {
      $scope.menus.selectedMenu = key;
      if (key === 'Songs') {
        $scope.menus.nameCurrentMenu = $i18next('menu.songs');
      } else {
        if (key === 'Playlists') {
          $scope.menus.nameCurrentMenu = $i18next('menu.playlsits');
        }
      }

    };

    // click link 'home'
    $scope.clickLinkHome = function () {
      $scope.menus.selectedMenu = 'Songs';
      $scope.menus.nameCurrentMenu = $i18next('menu.songs');
      //$scope.menus.isClickLinkHome = true;
      //playlistService.removeCached();
      //songService.removeCached();
    };

    // change language of web app
    $scope.$watch('languageWeb', function (newValue) {
      $i18next.options.lng = newValue;
      //$scope.menus.nameCurrentMenu = $i18next('menu.songs');
    });

    $scope.$on('$destroy', function () {
      console.log('scope destroy! main');
    });
  }
  menuMusic.$inject = [];
  mainController.$inject = ['$scope', '$mdSidenav', '$i18next'];
  angular.module('musicApp')
    .directive('menuMusic', menuMusic)
    .controller('mainController', mainController);
})();
