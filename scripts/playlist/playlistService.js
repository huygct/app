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
      var gotData = false;  // Check to read file json
      var self = this;

      var showSearch = false; // use to save value showSearch of playlist
      var querySearch = {}; // use to save value querySearch of playlist
      var state = ''; // use to save value state of playlist
      var cachePlaylist = {}; // use to save value current playlist

      var playlists = [];

      var NOT_FOUND = -1;

      function findObjectById(id, objects) {
        for (var i = 0; i < objects.length; i++) {
          if(objects[i].id === id) {
            return i;
          }
        }
        return NOT_FOUND;
      }

      function findObjectAndPerformAction(id, objects, actionCallback) {
        var index = findObjectById(id, objects);

        if(index !== NOT_FOUND) {
          actionCallback(index);
        } else {
          throw new Error('Can\'t find object with id ' + id);
        }
      }

      function findPlaylistById(playlists, id) {
        findObjectAndPerformAction(id, playlists, function (idx) {
          return playlists[idx];
        });
      }

      // read file json
      self.getListPlaylist = function (url) {
        var deferred = $q.defer();
        if (gotData === true) {
          deferred.resolve(playlists);
        } else {
          $http.get(url)
            .success(function (response) {
              gotData = true;
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
      self.savePlaylist = function (newPlaylist) {
        findObjectAndPerformAction(newPlaylist.id, playlists, function (idx) {
          playlists[idx] = newPlaylist;
        });
      };

      self.deleteOnePlaylist = function (id) {
        findObjectAndPerformAction(id, playlists, function (idx) {
          playlists.splice(idx, 1);
        });
      };

      self.deleteManyPlaylist = function (oldplaylists) {
        playlists = [];
        angular.forEach(oldplaylists, function (playlist) {
          if (playlist.check === false) {
            playlists.push(playlist);
          }
        });
        //console.log(playlists);
      };

      // add and remove song for playlist
      self.addAndRemoveSongForPlaylist = function (playlist, songs) {
        findObjectAndPerformAction(playlist.id, playlists, function (idx) {
          playlists[idx].songs = songs;
        });
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

      // remove cached
      self.removeCached = function () {
        showSearch = false; // use to save value showSearch of playlist
        querySearch = {}; // use to save value querySearch of playlist
        state = ''; // use to save value state of playlist
        cachePlaylist = {}; // use to save value current playlist

        for(var i = 0; i < playlists.length; i++) {
          playlists[i].check = false;
        }
      };
    }]);

})();