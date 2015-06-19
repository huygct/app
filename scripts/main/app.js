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
    // module A
    // module B
  ])
  .config(['$routeProvider', function ($routeProvider) {
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
        redirectTo: '/songs'
      });
  }])
;
