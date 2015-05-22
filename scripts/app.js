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
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'SongController',
                controllerAs: 'songCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .directive("menuMusic", function () {
        return {
            restrict: "E",
            templateUrl: "views/template/menu-music.html",
        }
    })
    .directive("managerSong", function () {
        return {
            restrict: "E",
            templateUrl: "views/template/manager-song.html"
        }
    })
    .directive("managerPlaylist", function () {
        return {
            restrict: "E",
            templateUrl: "views/template/manager-playlist.html"
        }
    })
;
