'use strict';

/**
 * @ngdoc overview
 * @name musicApp
 * @description
 * # musicApp
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
    .directive('menuMusic', [ function () {
        return {
            restrict: 'E', // should use 'A'
            templateUrl: 'scripts/menu-music.html'
        };
    }])
    .controller('mainController', ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {
        $scope.menus = {};
        $scope.menus.selectedMenu = 'Song';

        $scope.toggleSidenav = function (menuId, nameMenu) {
            $mdSidenav(menuId).toggle();
            $scope.menus.selectedMenu = nameMenu;

        };
    }])
;
