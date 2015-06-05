/**
 * Created by thuynghi on 5/26/2015.
 */
'use strict';

(function () {

    angular.module('musicApp')
        .service('songService', ['$http', '$q', function ($http, $q) {
            //function SongService($http) {
            var wasGetData = false;
            var self = this;

            var showSearch = false;
            var querySearch = {};
            var state = '';
            var cacheSong = {};

            var songs = [];

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

            self.addSong = function (song) {
                if (songs.length !== 0) {
                    song.id = songs[songs.length - 1].id + 1;
                    songs.push(song);
                } else {
                    song.id = 0;
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

            // Promise-based API
            //return {
            //    loadAllUsers: function () {
            //        // Simulate async nature of real remote calls
            //        return $q.when(songs);
            //    }
            //};


        }]);

})();