'use strict';

/**
 * main controller for web music manager
 */

(function () {
  function menuMusic() {
    return {
      restrict: 'E', // should use 'A'
      templateUrl: 'scripts/main/menu-music.html'
    };
  }

  function mainController (playlistService, songService, $scope, $mdSidenav, $i18next) {

    $i18next.options.lng = 'en';
    $scope.languageWeb = 'english';

    $scope.menus = {};
    $scope.menus.selectedMenu = 'Songs';
    // catch event click link 'Home'
    //$scope.menus.isClickLinkHome = false;

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
      $scope.menus.selectedMenu = 'Songs';
      //$scope.menus.isClickLinkHome = true;
      //playlistService.removeCached();
      //songService.removeCached();
    };

    // change language of web app
    $scope.$watch('languageWeb', function (newValue) {
      console.log(newValue);

      if (newValue === 'english') {
        $i18next.options.lng = 'en';
      } else {
        if (newValue === 'vietnam') {
          $i18next.options.lng = 'vi';
          console.log($scope.languageWeb);
        }
      }
    });

    $scope.$on('$destroy', function () {
      console.log('scope destroy! main');
    });
  }
  menuMusic.$inject = [];
  mainController.$inject = ['playlistService', 'songService', '$scope', '$mdSidenav', '$i18next'];
  angular.module('musicApp')
    .directive('menuMusic', menuMusic)
    .controller('mainController', mainController);
})();
