//'use strict';
//
///**
// * @ngdoc function
// * @name musicApp
// * @description
// * # PlaylistController
// */
//angular.module('musicApp')
//    .controller('PlaylistGridController', ['playlistService', 'songService', '$scope', '$mdDialog', function (playlistService, songService, $scope, $mdDialog) {
//        // it is cheat about memory aria of $scope.menus :)
//        $scope.childmenus = $scope.menus;
//        $scope.childmenus.selectedMenu = 'Playlist';
//
//        var self = this;
//        self.songs = [];
//
//        self.playlists = [];
//
//        self.markAll = false;
//        self.showSearch = false;
//        self.querySearch = {};
//
//        self.songs = [];
//        self.songsInsidePlaylist = [];
//
//        self.oldPlaylist = {};
//        self.newPlaylist = {};
//
//        self.checkToShowButtonDelete = false;
//        self.state = '';
//
//        self.column = [
//            {
//                name: 'Name',
//                key: 'name',
//                className: 'name-playlist'
//            },
//            {
//                name: 'Description ',
//                key: 'description',
//                className: 'description-playlist'
//            }];
//
//        // click button search
//        self.setIsSearch = function () {
//            self.showSearch = true;
//            playlistService.setShowSearch(true);
//        };
//
//        // close button search
//        self.setIsNotSearch = function () {
//            self.showSearch = false;
//            songService.setShowSearch(false);
//
//            self.querySearch.value = '';
//            playlistService.setQuerySearch('');
//        };
//
//        // ----------------------------------------------------------
//        self.changeStateToAdd = function () {
//            self.state = 'create';
//            playlistService.setState(self.state, self.newPlaylist); // save for song service
//        };
//
//        self.changeStateToManage = function () {
//            self.oldPlaylist = {};
//            self.newPlaylist = {};
//
//            self.state = '';
//            playlistService.setState(self.state, {}); // save for song service
//        };
//
//        self.changeStateToEdit = function (playlist) {
//            self.oldPlaylist.name = playlist.name;
//            self.oldPlaylist.description = playlist.description;
//            self.oldPlaylist.songs = playlist.songs;
//            self.oldPlaylist.id = playlist.id;
//            self.state = 'edit';
//            playlistService.setState(self.state, self.oldPlaylist); // save for song service
//        };
//        //-------------------------------------------------------------
//
//        self.addPlaylistByClick = function (playlist) {
//            self.newPlaylist = {};
//            playlistService.addPlaylist(playlist);
//
//            self.changeStateToManage();
//
//            getPlayLists();
//        };
//
//        self.savePlaylist = function (playlist) {
//            self.oldPlaylist = {};
//            playlistService.savePlaylist(playlist);
//            self.state = '';
//            playlistService.setState(self.state, {});
//
//            getPlayLists();
//        };
//
//
//        // self.playlistsForGrid = [];
//
//        function startPlaylist() {
//            getPlayLists();
//            getListSong();
//
//            self.showSearch = playlistService.getShowSearch();
//            self.querySearch = playlistService.getQuerySearch();
//            self.state = playlistService.getState();
//            if (self.state === 'create') {
//                self.newPlaylist = playlistService.getCachePlaylist();
//            } else if (self.state === 'edit') {
//                self.oldPlaylist = playlistService.getCachePlaylist();
//            } else {
//                self.oldPlaylist = {};
//                self.newPlaylist = {};
//            }
//        }
//
//        self.setSongForPlaylist = function (playlist, $event) {
//            var parentEl = angular.element(document.body);
//            $mdDialog.show({
//                parent: parentEl,
//                targetEvent: $event,
//                locals: {
//                    songs: angular.copy(self.songs),
//                    playlist: angular.copy(playlist)
//                },
//                templateUrl: 'scripts/playlist/select-songs.html',
//                controller: dialogSetSongForPlaylist
//            });
//        };
//
//        self.addPlaylist = function () {
//            //console.log(self.namePlaylist);
//            if (event.keyCode === 13 && self.playlist.name) {
//                playlistService.addPlaylist(self.playlist);
//                self.playlist = {};
//                getPlayLists();
//            }
//        };
//
//        function setSongOutSidePlaylist(songs, songsInsidePlaylist) {
//            var songsOutsidePlaylist = [];
//            for (var i = 0; i < songs.length; i++) {
//                var check = false;
//                for (var j = 0; j < songsInsidePlaylist.length; j++) {
//                    if (songs[i].id === songsInsidePlaylist[j].id) {
//                        check = true;
//                        break;
//                    }
//                }
//                if (check === false) {
//                    songsOutsidePlaylist.push(songs[i]);
//                }
//            }
//            return songsOutsidePlaylist;
//        }
//
//        function dialogSetSongForPlaylist(scope, $mdDialog, songs, playlist) {
//            scope.songs = songs;
//            scope.songsInsidePlaylist = playlist.songs;
//            scope.songsOutsidePlaylist = setSongOutSidePlaylist(scope.songs, scope.songsInsidePlaylist);
//
//            scope.closeDialog = function () {
//                //for (var i = 0; i < scope.songsOutsidePlaylist.length; i++) {
//                //    scope.songsOutsidePlaylist[i].select = false;
//                //}
//                //for (var i = 0; i < scope.songsInsidePlaylist.length; i++) {
//                //    scope.songsInsidePlaylist[i].select = false;
//                //}
//                $mdDialog.hide();
//            };
//            scope.addSongToPlaylist = function () {
//                for (var i = 0; i < scope.songsOutsidePlaylist.length; i++) {
//                    if (scope.songsOutsidePlaylist[i].select === true) {
//                        scope.songsOutsidePlaylist[i].select = false;
//                        scope.songsInsidePlaylist.push(scope.songsOutsidePlaylist[i]);
//                        scope.songsOutsidePlaylist.splice(i, 1);
//                        i--;
//                    }
//                }
//            };
//            scope.removeSongFromPlaylist = function () {
//                for (var i = 0; i < scope.songsInsidePlaylist.length; i++) {
//                    if (scope.songsInsidePlaylist[i].select === true) {
//                        scope.songsInsidePlaylist[i].select = false;
//                        scope.songsOutsidePlaylist.push(scope.songsInsidePlaylist[i]);
//                        scope.songsInsidePlaylist.splice(i, 1);
//                        i--;
//                    }
//                }
//            };
//
//            scope.comfirmAddAndRemoveSongForPlaylist = function () {
//                for (var i = 0; i < scope.songsInsidePlaylist.length; i++) {
//                    scope.songsInsidePlaylist[i].select = false;
//                }
//                self.oldPlaylist.songs = scope.songsInsidePlaylist;
//                $mdDialog.hide();
//            };
//        }
//
//        // set value for 'checkToShowButtonDelete'
//        self.setCheckToShowButtonDelete = function () {
//            self.checkToShowButtonDelete = checkToShowButtonDelete();
//        };
//
//        // calculate value of 'checkToShowButtonDelete'
//        function checkToShowButtonDelete() {
//            for (var i = 0; i < self.playlists.length; i++) {
//                if (self.playlists[i].check === true) {
//                    return true;
//                }
//            }
//            return false;
//        }
//
//        function dialogControllerForDeleteSingle(scope, $mdDialog, playlist, title, context) {
//            //scope.playlist = playlist;
//            scope.title = title;
//            scope.context = context;
//            scope.closeDialog = function () {
//                $mdDialog.hide();
//            };
//            scope.comfirmDelete = function () {
//                //console.log(song.id);
//                //self.songs.splice(song.id, 1);
//                playlistService.deleteOnePlaylist(playlist.id);
//
//                self.state = '';
//                playlistService.setState(self.state, {}); // save for playlist service
//                getPlayLists();
//
//                self.checkToShowButtonDelete = checkToShowButtonDelete(); // check status of button delete
//                $mdDialog.hide();
//            };
//        }
//
//        // delete dialog
//        self.showConfirmDeleteSingle = function (event, playlist) {
//            // Appending dialog to document.body to cover sidenav in docs app
//            var parentEl = angular.element(document.body);
//            $mdDialog.show({
//                parent: parentEl,
//                targetEvent: event,
//                templateUrl: 'scripts/template/delete-single.html',
//                locals: {
//                    playlist: playlist,
//                    title: 'Delete playlist',
//                    context: 'Are you sure you want to delete this playlist? '
//                },
//                controller: dialogControllerForDeleteSingle
//            });
//
//        };
//
//        function getListSong() {
//            songService.getListSong()
//                .then(function successCallback(data) {
//                    self.songs = data;
//                }, function errorCallback(result) {
//                    console.log('Fail to get songs' + result);
//                }
//            );
//        }
//
//        function getPlayLists() {
//            playlistService.getListPlaylist('data/playlist.json')
//                .then(function successCallback(data) {
//                    self.playlists = data;
//                     self.playlistsForGrid = buildGridModel(data);
//                }, function errorCallback(result) {
//                    console.log('Fail to get playlist' + result);
//                }
//            );
//        }
//
//        function buildGridModel(playlists) {
//            var it, results = [];
//
//            for (var j = 0; j < playlists.length; j++) {
//
//                it = playlists[j];
//
//                switch (j + 1) {
//                    case 1:
//                        it.background = 'red';
//                        it.span.row = it.span.col = 2;
//                        break;
//
//                    case 2:
//                        it.background = 'green';
//                        break;
//                    case 3:
//                        it.background = 'darkBlue';
//                        break;
//                    case 4:
//                        it.background = 'blue';
//                        it.span.col = 2;
//                        break;
//
//                    case 5:
//                        it.background = 'yellow';
//                        it.span.row = it.span.col = 2;
//                        break;
//
//                    case 6:
//                        it.background = 'pink';
//                        break;
//                    case 7:
//                        it.background = 'darkBlue';
//                        break;
//                    case 8:
//                        it.background = 'purple';
//                        break;
//                    case 9:
//                        it.background = 'deepBlue';
//                        break;
//                    case 10:
//                        it.background = 'lightPurple';
//                        break;
//                    case 11:
//                        it.background = 'yellow';
//                        break;
//                }
//
//                results.push(it);
//            }
//            return results;
//        }
//
//        startPlaylist();
//
//
//
//
//// dialog
//self.showConfirmDeleteSingle = function (ev, song) {
//  // Appending dialog to document.body to cover sidenav in docs app
//  var parentEl = angular.element(document.body);
//  $mdDialog.show({
//    parent: parentEl,
//    targetEvent: ev,
//    templateUrl: 'scripts/song/delete-single.html',
//    locals: {
//      items: song
//    },
//    controller: dialogControllerForDeleteSingle
//  });
//
//};
//
//// delete many songs
//self.showConfirmDeleteMultiple = function (ev) {
//  // Appending dialog to document.body to cover sidenav in docs app
//  var parentEl = angular.element(document.body);
//  $mdDialog.show({
//    parent: parentEl,
//    targetEvent: ev,
//    templateUrl: 'scripts/song/delete-multiple.html',
//    controller: dialogControllerForDeleteMultiple
//  });
//};
//
//// mark all songs
//self.toggleMarkAll = function () {
//  angular.forEach(self.songs, function (song) {
//    song.check = self.markAll;
//  });
//  self.checkToShowButtonDelete = checkToShowButtonDelete(); // check status of button delete
//};
//
//// click button search
//self.setIsSearch = function () {
//  self.showSearch = true;
//  songService.setShowSearch(true);
//};
//
//// close button search
//self.setIsNotSearch = function () {
//  self.showSearch = false;
//  songService.setShowSearch(false);
//
//  self.querySearch.value = '';
//  songService.setQuerySearch('');
//};
//
//$scope.$on('$destroy', function () {
//  console.log('scope destroy!');
//});
//
//function dialogControllerForDeleteSingle(scope, $mdDialog, items) {
//  scope.items = items;
//  scope.closeDialog = function () {
//    $mdDialog.hide();
//  };
//  scope.comfirmDelete = function () {
//    //console.log(song.id);
//    //self.songs.splice(song.id, 1);
//    songService.deleteOneSong(items.id);
//
//    self.state = '';
//    songService.setState(self.state, {}); // save for song service
//    getListSong();
//
//    self.checkToShowButtonDelete = checkToShowButtonDelete(); // check status of button delete
//    $mdDialog.hide();
//  };
//}
//
//function dialogControllerForDeleteMultiple(scope, $mdDialog) {
//  scope.closeDialog = function () {
//    $mdDialog.hide();
//  };
//  scope.comfirmDeleteAll = function () {
//    //var oldSongs = self.songs;
//    //self.songs = [];
//    //angular.forEach(oldSongs, function (song) {
//    //    if (!song.check) {
//    //        self.songs.push(song);
//    //    }
//    //});
//    songService.deleteManySong(self.songs);
//    //_setIndexes();
//
//    self.state = '';
//    songService.setState(self.state, {}); // save for song service
//
//    getListSong();
//
//    self.markAll = false;
//    self.checkToShowButtonDelete = false; // check status of button delete
//    $mdDialog.hide();
//  };
//}
//
//getListSong();
//    }])
//;
