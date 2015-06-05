'use strict';

/**
 * @ngdoc function
 * @name musicApp
 * @description
 * # PlaylistController
 */
angular.module('musicApp')
    .controller('PlaylistController', ['playlistService', 'songService', '$scope', '$mdDialog', function (playlistService, songService, $scope, $mdDialog) {
        // it is cheat about memory aria of $scope.menus :)
        $scope.childmenus = $scope.menus;
        $scope.childmenus.selectedMenu = 'Playlist';

        var self = this;
        self.songs = [];

        self.playlists = [];

        self.markAll = false;
        self.showSearch = false;
        self.querySearch = {};

        self.songs = [];

        self.oldPlaylist = {};
        self.newPlaylist = {};

        self.checkToShowButtonDelete = false;
        self.state = '';

        self.column = [
            {
                name: 'Name',
                className: 'name-song'
            },
            {
                name: 'Description ',
                className: 'artist-song'
            }];



        // ----------------------------------------------------------
        self.changeStateToAdd = function () {
            self.state = 'create';
            playlistService.setState(self.state, self.newPlaylist); // save for song service
        };

        self.changeStateToManage = function () {
            self.oldPlaylist = {};
            self.newPlaylist = {};

            self.state = '';
            playlistService.setState(self.state, {}); // save for song service
        };

        self.changeStateToEdit = function (playlist) {
            self.oldPlaylist.name = playlist.name;
            self.oldPlaylist.artist = playlist.artist;
            self.oldPlaylist.id = playlist.id;
            self.state = 'edit';
            playlistService.setState(self.state, self.oldPlaylist); // save for song service
        };
        //-------------------------------------------------------------

        self.addPlaylistByClick = function (playlist) {
            self.newPlaylist = {};
            playlistService.addPlaylist(playlist);

            self.changeStateToManage();

            getPlayLists();
        };

        self.savePlaylist = function (playlist) {
            self.oldPlaylist = {};
            playlistService.savePlaylist(playlist);
            self.state = '';
            playlistService.setState(self.state, {});
            getPlayLists();
        };





        // self.playlistsForGrid = [];

        function startPlaylist() {
            getPlayLists();
            getListSong();

            self.showSearch = playlistService.getShowSearch();
            self.querySearch = playlistService.getQuerySearch();
            self.state = playlistService.getState();
            if (self.state === 'create') {
                self.newPlaylist = playlistService.getCachePlaylist();
            } else if (self.state === 'edit') {
                self.oldPlaylist = playlistService.getCachePlaylist();
            } else {
                self.oldPlaylist = {};
                self.newPlaylist = {};
            }
        }

        self.setSongForPlaylist = function (playlist, $event) {
            console.log('aaa');

            var parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                targetEvent: $event,
                locals: {
                    songs: self.songs
                },
                templateUrl: 'scripts/playlist/select-songs.html',
                controller: dialogSetSongForPlaylist
            });
        };

        self.addPlaylist = function () {
            //console.log(self.namePlaylist);
            if (event.keyCode === 13 && self.playlist.name) {
                playlistService.addPlaylist(self.playlist);
                self.playlist = {};
                getPlayLists();
            }
        };

        function dialogSetSongForPlaylist(scope, $mdDialog, songs) {
            scope.songs = songs;
            scope.closeDialog = function () {
                $mdDialog.hide();
            };
            scope.comfirmDeleteAll = function () {
                // something
                $mdDialog.hide();
            };
        }

        function getListSong() {
            songService.getListSong()
                .then(function successCallback(data) {
                    self.songs = data;
                }, function errorCallback(result) {
                    console.log('Fail to get songs' + result);
                }
            );
        }

        function getPlayLists() {
            playlistService.getListPlaylist('data/playlist.json')
                .then(function successCallback(data) {
                    self.playlists = data;
                    // self.playlistsForGrid = buildGridModel(data);
                }, function errorCallback(result) {
                    console.log('Fail to get playlist' + result);
                }
            );
        }

        //function buildGridModel(playlists) {
        //    var it, results = [];
        //
        //    for (var j = 0; j < playlists.length; j++) {
        //
        //        it = playlists[j];
        //
        //        switch (j + 1) {
        //            case 1:
        //                it.background = 'red';
        //                it.span.row = it.span.col = 2;
        //                break;
        //
        //            case 2:
        //                it.background = 'green';
        //                break;
        //            case 3:
        //                it.background = 'darkBlue';
        //                break;
        //            case 4:
        //                it.background = 'blue';
        //                it.span.col = 2;
        //                break;
        //
        //            case 5:
        //                it.background = 'yellow';
        //                it.span.row = it.span.col = 2;
        //                break;
        //
        //            case 6:
        //                it.background = 'pink';
        //                break;
        //            case 7:
        //                it.background = 'darkBlue';
        //                break;
        //            case 8:
        //                it.background = 'purple';
        //                break;
        //            case 9:
        //                it.background = 'deepBlue';
        //                break;
        //            case 10:
        //                it.background = 'lightPurple';
        //                break;
        //            case 11:
        //                it.background = 'yellow';
        //                break;
        //        }
        //
        //        results.push(it);
        //    }
        //    return results;
        //}

        startPlaylist();

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
    }])
;
