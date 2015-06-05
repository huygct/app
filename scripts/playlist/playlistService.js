/**
 * Created by thuynghi on 6/5/2015.
 */
'use strict';

(function () {

    angular.module('musicApp')
        .service('playlistService', ['$http', '$q', function ($http, $q) {

            var isGetPlaylist = false;
            var self = this;

            var showSearch = false;
            var querySearch = {};
            var state = '';
            var cachePlaylist = {};
            
            var playlists = [];

            self.getListPlaylist = function (url) {
                var deferred = $q.defer();
                if(isGetPlaylist === true) {
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

            self.getPlaylist = function (_id) {
                return findPlaylistById(playlists, _id);
            };

            self.addPlaylist = function (playlist) {
                if (playlists.length !== 0) {
                    playlist.id = playlists[playlists.length - 1].id + 1;
                    playlist.image = 'none';
                    playlist.background = 'green';
                    playlist.span = {'row': 1, 'col': 1};
                    playlist.check = false;
                    playlists.push(playlist);
                } else {
                    playlist.id = 0;
                    playlist.image = '';
                    playlist.background = '';
                    playlist.span.row = 1;
                    playlist.span.col = 1;
                    playlist.check = false;
                    playlists.push(playlist);
                }
            };

            //----------------------------------------------------
            self.savePlaylist = function (playlistNew) {
                for (var i = 0; i < playlists.length; i++) {
                    if (playlists[i].id === playlistNew.id) {
                        playlists[i] = playlistNew;
                        console.log('Gia tri i edit');
                        console.log(i);
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
            
            
            
            
            
            function findPlaylistById (playlists, _id) {
                for (var i = 0; i < playlists.length; i++) {
                    if(playlists[i].id === _id) {
                        return playlists[i];
                    }
                }
                throw new Error('Couldn\'t find object with id: ' + _id);
            }
        }]);

})();