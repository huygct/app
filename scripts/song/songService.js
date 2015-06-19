/**
 * Created by thuynghi on 5/26/2015.
 */
'use strict';
/**
 * songService uses to read json and cached some value of page playlist
 */
(function () {

  angular.module('musicApp')
    .service('songService', ['$http', '$q', function ($http, $q) {
      var gotData = false; // mark that it read file json
      var self = this;

      var showSearch = false; // cached value showSearch
      var querySearch = {}; // cached value querySearch
      var state = ''; // cached value state
      var cacheSong = {}; // cached current song

      var songs = [];

      // read file json
      self.getListSong = function () {
        var deferred = $q.defer();

        if (gotData) {
          deferred.resolve(songs);
        } else {
          $http.get('data/song.json')
            .success(function (response) {
              gotData = true;
              songs = response;
              deferred.resolve(response);
            })
            .error(function (response) {
              deferred.reject(response);
            });
        }
        return deferred.promise;
      };

      self.getSong = function (id) {
        return findSongById(songs, id);
      };

      self.getSongs = function (ids) {
        return findSongsByIds(songs, ids);
      };

      self.addSong = function (song) {
        if (songs.length !== 0) {
          song.id = songs[songs.length - 1].id + 1;
          songs.push(song);
        } else {
          song.id = 0;
          songs.push(song);
        }
      };


      // start template pattern -------------------------------------------------------------------------------------
      var NOT_FOUND = -1;

      function findSongIdx (id) {
        for (var i = 0; i < songs.length; i++) {
          if (songs[i].id === id) {
            return i;
          }
        }
        return NOT_FOUND;
      }

      function findSongAndPerformAction(id, actionCallback) {
        var index = findSongIdx(id);

        if (index !== NOT_FOUND) {
          actionCallback(index);
        } else {
          throw new Error('Can\'t find song with id ' + id);
        }
      }

      self.saveSong = function (newSong) {
        findSongAndPerformAction(newSong.id, function actionCallback(idx) {
          songs[idx] = newSong;
        });
      };

      self.deleteOneSong = function (id) {
        findSongAndPerformAction(id, function actionCallback(idx) {
          songs.splice(idx, 1);
        });
      };
      // end template pattern -------------------------------------------------------------------------------------

      self.deleteManySong = function (oldSongs) {
        songs = [];
        angular.forEach(oldSongs, function (song) {
          if (song.check === false) {
            songs.push(song);
          }
        });
        console.log(songs);
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
      self.setState = function (_state, _cacheSong) {
        state = _state;
        cacheSong = _cacheSong;
      };
      self.getState = function () {
        return state;
      };
      self.getCacheSong = function () {
        return cacheSong;
      };

      // find song By Id
      function findSongById(source, id) {
        findSongAndPerformAction(id, function actionCallback(idx) {
          return source(idx);
        });
        throw new Error('Couldn\'t find object with id: ' + id);
      }

      // find songs By Id
      function findSongsByIds(source, ids) {
        var _songs = [];
        for (var i = 0; i < ids.length; i++) {
          findSongAndPerformAction(ids[i], function actonCallback(idx) {
            _songs.push(source[idx]);
          });
        }
        if (_songs.length !== 0) {
          return _songs;
        } else {
          throw new Error('Couldn\'t find object');
        }
      }
    }]);
})();