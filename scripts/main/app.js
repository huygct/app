'use strict';

/**
 * @ngdoc overview
 * @name musicApp
 * @description
 * # musicApp use to manage songs and playlist
 *
 * Main module of the application.
 */
angular
  .module('musicApp', [
    'ngMessages',
    'ngMaterial',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/songs', {
        templateUrl: 'scripts/song/song.html',
        controller: 'SongController',
        controllerAs: 'songCtrl'
      })
      .when('/playlist', {
        templateUrl: 'scripts/playlist/playlist.html',
        controller: 'PlaylistController',
        controllerAs: 'playlistCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .directive('menuMusic', [function () {
    return {
      restrict: 'E', // should use 'A'
      templateUrl: 'scripts/main/menu-music.html'
    };
  }])
  .directive('ngRightClick', ['$parse', function ($parse) {
    return function (scope, element, attrs) {
      var fn = $parse(attrs.ngRightClick);
      element.bind('contextmenu', function (event) {
        scope.$apply(function () {
          event.preventDefault();
          fn(scope, {$event: event});
        });
      });
    };
  }])
  .directive('fileModel', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  }])

  .service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
      var fd = new FormData();
      fd.append('file', file);
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
        .success(function () {
        })
        .error(function () {
        });
    };
  }])

  .controller('mainController', ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {
    $scope.menus = {};
    $scope.menus.selectedMenu = 'Song';
    $scope.menus.isClickLinkHome = false;

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

    $scope.clickLinkHome = function () {
      $scope.menus.isClickLinkHome = true;
    };

    $scope.$on('$destroy', function () {
      console.log('scope destroy! main');
    });

    start();
  }])
;
