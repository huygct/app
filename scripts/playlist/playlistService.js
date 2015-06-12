/**
 * Created by thuynghi on 6/5/2015.
 */
'use strict';

/**
 * playlist service uses to cache some value
 * and read playlist from file json
 */
(function () {

  angular.module('musicApp')
    .service('playlistService', ['$http', '$q', function ($http, $q) {

      var isGetPlaylist = false;  // Check to read file json
      var self = this;

      var showSearch = false; // use to save value showSearch of playlist
      var querySearch = {}; // use to save value querySearch of playlist
      var state = ''; // use to save value state of playlist
      var cachePlaylist = {}; // use to save value current playlist

      var playlists = [];

      // read file json
      self.getListPlaylist = function (url) {
        var deferred = $q.defer();
        if (isGetPlaylist === true) {
          deferred.resolve(playlists);
        } else {
          $http.get(url)
            .success(function (response) {
              isGetPlaylist = true;
              playlists = response;
              deferred.resolve(response);
            })
            .error(function (response) {
              deferred.reject(response);
            });
        }
        return deferred.promise;
      };

      // get playlist by id
      self.getPlaylist = function (_id) {
        return findPlaylistById(playlists, _id);
      };

      // add playlist
      self.addPlaylist = function (playlist) {
        if (playlists.length !== 0) {
          playlist.id = playlists[playlists.length - 1].id + 1;
          playlist.image = 'none';
          playlist.background = 'green';
          playlist.check = false;
          playlists.push(playlist);
        } else {
          playlist.id = 0;
          playlist.image = '';
          playlist.background = '';
          playlist.check = false;
          playlists.push(playlist);
        }
      };

      //----------------------------------------------------
      self.savePlaylist = function (playlistNew) {
        for (var i = 0; i < playlists.length; i++) {
          if (playlists[i].id === playlistNew.id) {
            playlists[i] = playlistNew;
            //console.log('Gia tri i edit');
            //console.log(i);
            break;
          }
        }
      };

      self.deleteOnePlaylist = function (_id) {
        for (var i = 0; i < playlists.length; i++) {
          if (playlists[i].id === _id) {
            playlists.splice(i, 1);
            break;
          }
        }
      };

      self.deleteManyPlaylist = function (oldplaylists) {
        playlists = [];
        angular.forEach(oldplaylists, function (playlist) {
          if (playlist.check === false) {
            playlists.push(playlist);
          }
        });
        console.log(playlists);
      };

      // add and remove song for playlist
      self.addAndRemoveSongForPlaylist = function (playlist, songs) {
        for (var i = 0; i < playlists.length; i++) {
          if (playlists[i].id === playlist.id) {
            playlists[i].songs = songs;
          }
        }
      };

      // cache data
      self.setShowSearch = function (_showSearch) {
        showSearch = _showSearch;
      };
      self.getShowSearch = function () {
        return showSearch;
      };
      self.setQuerySearch = function (query) {
        querySearch.value = query;
      };
      self.getQuerySearch = function () {
        return querySearch;
      };
      // cache state
      self.setState = function (_state, _cache) {
        state = _state;
        cachePlaylist = _cache;
      };
      self.getState = function () {
        return state;
      };
      self.getCachePlaylist = function () {
        return cachePlaylist;
      };


      function findPlaylistById(playlists, _id) {
        for (var i = 0; i < playlists.length; i++) {
          if (playlists[i].id === _id) {
            return playlists[i];
          }
        }
        throw new Error('Couldn\'t find object with id: ' + _id);
      }
    }]);

})();