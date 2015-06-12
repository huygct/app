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
      var wasGetData = false; // mark that it read file json
      var self = this;

      var showSearch = false; // cached value showSearch
      var querySearch = {}; // cached value querySearch
      var state = ''; // cached value state
      var cacheSong = {}; // cached current song

      var songs = [];

      // read file json
      self.getListSong = function () {
        var deferred = $q.defer();

        if (wasGetData === true) {
          deferred.resolve(songs);
        } else {
          $http.get('data/song.json')
            .success(function (response) {
              wasGetData = true;
              songs = response;
              deferred.resolve(response);
            })
            .error(function (response) {
              deferred.reject(response);
            });
        }
        return deferred.promise;
      };

      self.getSong = function (_id) {
        return findSongById(songs, _id);
      };

      self.getSongs = function (ids) {
        return findSongsByIds(songs, ids);
      };

      self.addSong = function (song) {
        if (songs.length !== 0) {
          song.id = songs[songs.length - 1].id + 1;
          //song.url = file.name;
          songs.push(song);
        } else {
          song.id = 0;
          //song.url = file.name;
          songs.push(song);
        }
        //console.log(songs);
      };

      self.saveSong = function (songNew) {
        for (var i = 0; i < songs.length; i++) {
          if (songs[i].id === songNew.id) {
            songs[i] = songNew;
            console.log('Gia tri i edit');
            console.log(i);
            break;
          }
        }
      };

      self.deleteOneSong = function (_id) {
        for (var i = 0; i < songs.length; i++) {
          if (songs[i].id === _id) {
            songs.splice(i, 1);
            break;
          }
        }
      };

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
        for (var i = 0; i < source.length; i++) {
          if (source[i].id === id) {
            return source[i];
          }
        }
        throw new Error('Couldn\'t find object with id: ' + id);
      }

      // find songs By Id
      function findSongsByIds(source, ids) {
        var _songs = [];
        for (var i = 0; i < ids.length; i++) {
          for (var j = 0; j < source.length; j++) {
            if (source[j].id === ids[i]) {
              _songs.push(source[j]);
              break;
            }
          }
        }
        if (_songs.length !== 0) {
          return _songs;
        } else {
          throw new Error('Couldn\'t find object');
        }
      }
    }]);
})();