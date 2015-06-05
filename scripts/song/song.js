'use strict';

/**
 * @ngdoc function
 * @name musicApp.controller
 * @description
 * # SongController
 */
angular.module('musicApp')
    .controller('SongController', ['songService', '$scope', '$mdSidenav', '$mdDialog', function (songService, $scope, $mdSidenav, $mdDialog) {
        // it is cheat about memory aria of $scope.menus :)
        $scope.childmenus = $scope.menus;
        $scope.childmenus.selectedMenu = 'Song';
        //console.log($scope.menus);

        var self = this;
        self.markAll = false;
        self.showSearch = false;
        self.querySearch = {};

        self.songs = [];

        self.oldSong = {};
        self.newSong = {};

        self.checkToShowButtonDelete = false;
        self.state = '';

        // the song choose before, use for press shift
        self.chooseBeforeSong = '';

        function getListSong() {
            songService.getListSong()
                .then(function successCallback(data) {
                    self.songs = data;
                }, function errorCallback(result) {
                    console.log('Fail to get songs' + result);
                }
            );

            self.showSearch = songService.getShowSearch();
            self.querySearch = songService.getQuerySearch();
            self.state = songService.getState();
            if (self.state === 'create') {
                self.newSong = songService.getCacheSong();
            } else if (self.state === 'edit') {
                self.oldSong = songService.getCacheSong();
            } else {
                self.oldSong = {};
                self.newSong = {};
            }
        }

        // set value for 'checkToShowButtonDelete'
        self.setCheckToShowButtonDelete = function () {
            self.checkToShowButtonDelete = checkToShowButtonDelete();
        };

        // calculate value of 'checkToShowButtonDelete'
        function checkToShowButtonDelete() {
            for (var i = 0; i < self.songs.length; i++) {
                if (self.songs[i].check === true) {
                    return true;
                }
            }
            return false;
        }

        self.setChooseSong = function (song, $event) {

            console.log($event.ctrlKey);


            if ($event.shiftKey) {
                //if (self.chooseBeforeSong.check === true) {
                //    var songId = self.chooseBeforeSong.id;
                //    if (songId < song.id) {
                //        for (var i = songId; i <= song.id; i++) {
                //                self.songs[i].check = true;
                //            }
                //        }
                //    }
                } else {
                if ($event.ctrlKey) {
                    // press ctrl
                    song.check = !song.check;
                } else {
                    for (var i = 0; i < self.songs.length; i++) {
                        if (self.songs[i].id === song.id) {
                            self.songs[i].check = !song.check;
                        } else {
                            self.songs[i].check = false;
                        }
                    }
                }
            }


            self.markAll = false;
            self.chooseBeforeSong = song;
            self.checkToShowButtonDelete = checkToShowButtonDelete(); // check status of button delete
        };

        // ----------------------------------------------------------
        self.changeStateToAdd = function () {
            self.state = 'create';
            songService.setState(self.state, self.newSong); // save for song service
        };

        self.changeStateToManage = function () {
            self.oldSong = {};
            self.newSong = {};

            self.state = '';
            songService.setState(self.state, {}); // save for song service
        };

        self.changeStateToEdit = function (song) {
            self.oldSong.name = song.name;
            self.oldSong.artist = song.artist;
            self.oldSong.id = song.id;
            self.state = 'edit';
            songService.setState(self.state, self.oldSong); // save for song service
        };
        //-------------------------------------------------------------

        // add song
        self.addSong = function (song) {
            self.newSong = {};
            //song.id = self.songs.length;
            //self.songs.push(song);
            songService.addSong(song);

            self.changeStateToManage();

            getListSong();
        };

        // save song
        self.saveSong = function (song) {
            self.oldSong = {};
            //self.songs.splice(song.id, 1, song);
            songService.saveSong(song);

            self.state = '';
            songService.setState(self.state, {}); // save for song service

            getListSong();
        };

        // dialog
        self.showConfirmDeleteSingle = function (ev, song) {
            // Appending dialog to document.body to cover sidenav in docs app
            var parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                targetEvent: ev,
                templateUrl: 'scripts/song/delete-single.html',
                locals: {
                    items: song
                },
                controller: dialogControllerForDeleteSingle
            });

        };

        // delete many songs
        self.showConfirmDeleteMultiple = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                targetEvent: ev,
                templateUrl: 'scripts/song/delete-multiple.html',
                controller: dialogControllerForDeleteMultiple
            });
        };

        // mark all songs
        self.toggleMarkAll = function () {
            angular.forEach(self.songs, function (song) {
                song.check = self.markAll;
            });
            self.checkToShowButtonDelete = checkToShowButtonDelete(); // check status of button delete
        };

        // click button search
        self.setIsSearch = function () {
            self.showSearch = true;
            songService.setShowSearch(true);
        };

        // close button search
        self.setIsNotSearch = function () {
            self.showSearch = false;
            songService.setShowSearch(false);

            self.querySearch.value = '';
            songService.setQuerySearch('');
        };

        $scope.$on('$destroy', function () {
            console.log('scope destroy!');
        });

        function dialogControllerForDeleteSingle(scope, $mdDialog, items) {
            scope.items = items;
            scope.closeDialog = function () {
                $mdDialog.hide();
            };
            scope.comfirmDelete = function () {
                //console.log(song.id);
                //self.songs.splice(song.id, 1);
                songService.deleteOneSong(items.id);

                self.state = '';
                songService.setState(self.state, {}); // save for song service
                getListSong();

                self.checkToShowButtonDelete = checkToShowButtonDelete(); // check status of button delete
                $mdDialog.hide();
            };
        }

        function dialogControllerForDeleteMultiple(scope, $mdDialog) {
            scope.closeDialog = function () {
                $mdDialog.hide();
            };
            scope.comfirmDeleteAll = function () {
                //var oldSongs = self.songs;
                //self.songs = [];
                //angular.forEach(oldSongs, function (song) {
                //    if (!song.check) {
                //        self.songs.push(song);
                //    }
                //});
                songService.deleteManySong(self.songs);
                //_setIndexes();

                self.state = '';
                songService.setState(self.state, {}); // save for song service

                getListSong();

                self.markAll = false;
                self.checkToShowButtonDelete = false; // check status of button delete
                $mdDialog.hide();
            };
        }

        getListSong();
    }]);
