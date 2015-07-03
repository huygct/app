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
    'ngTouch',
    'jm.i18next',
    'naturalSort',
    'com.tma.reusableComponents'
    // module A
    // module B
  ])
  .config(['$routeProvider', '$i18nextProvider', function ($routeProvider, $i18nextProvider) {
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
      .when('/test', {
        templateUrl: 'scripts/demo/test.html',
        controller: 'TestController',
        controllerAs: 'testCtrl'
      })
      .otherwise({
        redirectTo: '/songs'
      });

    $i18nextProvider.options = {
      lng: 'en', // If not given, i18n will detect the browser language.
      fallbackLng: 'en', // Default is dev
      useCookie: false,
      useLocalStorage: false,
      resGetPath: 'language/__lng__/translation.json'
    };
  }])
;
