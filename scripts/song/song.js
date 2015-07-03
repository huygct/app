'use strict';

/**
 * @ngdoc function
 * @name musicApp.controller
 * @description
 * # SongController
 */
angular.module('musicApp')
  .controller('SongController', ['songService', 'playlistService', '$scope', '$mdSidenav', '$mdDialog', '$i18next',
    function (songService, playlistService, $scope, $mdSidenav, $mdDialog, $i18next) {
      var self = this;

      var countSort = 0; // count to check sort type
      var keySorting = ''; // save value sorting

      // -----------------------------------------------------------------------
      var NOT_FOUND = -1;//hoisting , declaration time < running time
      function findObjectIsCheck(value, objects) {
        for (var i = 0; i < objects.length; i++) {
          if (objects[i].check === value) {
            return i;
          }
        }
        return NOT_FOUND;
      }
      // -----------------------------------------------------------------------
      // calculate value of 'checkToShowButtonDelete'
      function checkToShowButtonDelete() {
        return findObjectIsCheck(true, self.songs) !== NOT_FOUND;
      }
      // get songs from service and some values was cached
      function getListSong() {
        songService.getListSong()
          .then(function successCallback(data) {
            self.songs = data;
            self.checkToShowButtonDelete = checkToShowButtonDelete(); // check status of button delete
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

      // Controller for dialog deletes a song
      function dialogControllerForDeleteSingle(scope, $mdDialog, song, title, context) {
        scope.song = song;
        scope.title = title;
        scope.context = context;
        scope.closeDialog = function () {
          $mdDialog.hide();
        };
        scope.comfirmDelete = function () {
          songService.deleteOneSong(song.id);

          self.state = '';
          songService.setState(self.state, {}); // save for song service
          getListSong();

          self.checkToShowButtonDelete = checkToShowButtonDelete(); // check status of button delete
          $mdDialog.hide();
        };
      }

      // Controller for dialog deletes multiple song
      function dialogControllerForDeleteMultiple(scope, $mdDialog, title, context) {
        scope.title = title;
        scope.context = context;
        scope.closeDialog = function () {
          $mdDialog.hide();
        };
        scope.comfirmDeleteAll = function () {
          songService.deleteManySong(self.songs);

          self.state = '';
          songService.setState(self.state, {}); // save for song service

          getListSong();

          self.checkToShowButtonDelete = false; // check status of button delete
          $mdDialog.hide();
        };
      }

      // it is cheat about memory aria of $scope.menus :)
      $scope.childMenus = $scope.menus;
      $scope.childMenus.nameCurrentMenu = 'menu.songs';
      $scope.childMenus.selectedMenu = 'Songs';

      self.showSearch = false; // show or hide search box
      self.querySearch = {}; // values to search
      self.markAll = false; // set choose all songs

      self.songs = []; // array the song

      self.oldSong = {}; // uses to edit
      self.newSong = {}; // user to add

      self.checkToShowButtonDelete = false;
      self.state = ''; // state are manage, create or edit

      self.sortType = ''; // is name column of table, it uses to sort.
      self.sortReverse = false; // sort-asc or sort-desc

      self.column = [ // column name for table
        {
          name: 'contentWeb.songs.songTable.name',
          key: 'name',
          className: 'name-song'
        },
        {
          name: 'contentWeb.songs.songTable.artist',
          key: 'artist',
          className: 'artist-song'
        }];

      // set value for 'checkToShowButtonDelete'
      self.setCheckToShowButtonDelete = function () {
        self.checkToShowButtonDelete = checkToShowButtonDelete();
      };

      // select song when click row and press ctrl to choose songs
      self.setChooseSong = function (song, $event) {
        console.log($event.ctrlKey);
        if ($event.shiftKey) {

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
        //var file = song.file;
        //songService.addSong(song, file);
        song.check = false;
        if (typeof song.artist === 'undefined') {
          song.artist = 'none';
        }
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

      // dialog for delete a song
      self.showConfirmDeleteSingle = function (ev, song) {
        // Appending dialog to document.body to cover sidenav in docs app
        var parentEl = angular.element(document.body);
        $mdDialog.show({
          parent: parentEl,
          targetEvent: ev,
          templateUrl: 'scripts/template/delete-single.html',
          locals: {
            song: song,
            title: $i18next('deleteDialog.songs.single.title'),
            context: $i18next('deleteDialog.songs.single.context')
          },
          controller: dialogControllerForDeleteSingle
        });

      };

      // Delete songs
      self.showConfirmDeleteMultiple = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var parentEl = angular.element(document.body);
        $mdDialog.show({
          parent: parentEl,
          targetEvent: ev,
          templateUrl: 'scripts/template/delete-multiple.html',
          locals: {
            title: $i18next('deleteDialog.songs.multiple.title'),
            context: $i18next('deleteDialog.songs.multiple.context')
          },
          controller: dialogControllerForDeleteMultiple
        });
      };

      // click button search
      self.setIsSearch = function () {
        self.showSearch = true;
        songService.setShowSearch(true);
      };

      // click close 'x' in search box
      self.setIsNotSearch = function () {
        self.showSearch = false;
        songService.setShowSearch(false);

        self.querySearch.value = '';
        songService.setQuerySearch('');
      };

      // set value for sortType
      self.changeSortType = function (sortType) {
        countSort++;
        if (keySorting !== sortType) {
          keySorting = sortType;
          self.sortReverse = false;
          countSort = 1;

          if (countSort !== 3) {
            self.sortType = sortType;
            self.sortReverse = !self.sortReverse;
          } else {
            self.sortType = '';
            self.sortReverse = false;
            countSort = 0;
          }
        } else {
          if (countSort !== 3) {
            self.sortType = sortType;
            self.sortReverse = !self.sortReverse;
          } else {
            self.sortType = '';
            self.sortReverse = false;
            countSort = 0;
          }
        }
      };

      // catch event when destroy page song
      $scope.$on('$destroy', function () {
        //console.log('scope destroy!');
      });

      //function onLangChange() {
      //  $scope.childMenus.nameCurrentMenu = $i18next('menu.songs');
      //}
      //$scope.$on('i18nextLanguageChange', onLangChange);
      //$scope.$watch('childMenus.isClickLinkHome', function () {
      //  //console.log('change home');
      //  self.markAll = false;
      //  getListSong();
      //  $scope.childMenus.isClickLinkHome = false;
      //});


      getListSong();
    }])
;
