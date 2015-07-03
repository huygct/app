'use strict';

/**
 * @name musicApp
 * PlaylistController
 */
angular.module('musicApp')
  .controller('PlaylistController', ['playlistService', 'songService', 'playListExtend', 'playListChooseSongs', '$scope', '$mdDialog', '$i18next',
    function (playlistService, songService, playListExtend, playListChooseSongs, $scope, $mdDialog, $i18next) {

      var self = this;

      var countSort = 0; // count to check sort type
      var keySorting = ''; // save value sorting

      // get songs from service
      function getListSong() {
        songService.getListSong()
          .then(function successCallback(data) {
            self.songs = angular.copy(data);
            // set check of all songs is false
            for (var j = 0; j < self.songs.length; j++) {
              self.songs[j].check = false;
            }
          }, function errorCallback(result) {
            console.log('Fail to get songs' + result);
          }
        );
      }

      // get playlist from service
      function getPlayLists() {
        playlistService.getListPlaylist('data/playlist.json')
          .then(function successCallback(data) {
            self.playlists = data;
            self.checkToShowButtonDelete = checkToShowButtonDelete(); // check status of button delete
          }, function errorCallback(result) {
            console.log('Fail to get playlist' + result);
          }
        );
      }

      // is called when starts playlist page
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

      // calculate values of 'checkToShowButtonDelete'
      function checkToShowButtonDelete() {
        for (var i = 0; i < self.playlists.length; i++) {
          if (self.playlists[i].check === true) {
            return true;
          }
        }
        return false;
      }

      // Deletes a playlist
      function dialogControllerForDeleteSingle(scope, $mdDialog, playlist, title, context) {
        scope.title = title;
        scope.context = context;
        scope.closeDialog = function () {
          $mdDialog.hide();
        };
        scope.comfirmDelete = function () {
          playlistService.deleteOnePlaylist(playlist.id);

          self.state = '';
          playlistService.setState(self.state, {}); // save for playlist service
          getPlayLists();

          self.checkToShowButtonDelete = checkToShowButtonDelete(); // check status of button delete
          $mdDialog.hide();
        };
      }

      // Deletes some playlist
      function dialogControllerForDeleteMultiple(scope, $mdDialog, title, context) {
        scope.title = title;
        scope.context = context;
        scope.closeDialog = function () {
          $mdDialog.hide();
        };
        scope.comfirmDeleteAll = function () {
          playlistService.deleteManyPlaylist(self.playlists);

          self.state = '';
          playlistService.setState(self.state, {}); // save for song service

          getPlayLists();

          //self.markAll = false;
          self.checkToShowButtonDelete = false; // check status of button delete
          $mdDialog.hide();
        };
      }

      // it is cheat about memory aria of $scope.menus :)
      $scope.childMenus = $scope.menus;
      $scope.childMenus.nameCurrentMenu = 'menu.playlsits'; // set value for breadcrumb is Playlist
      $scope.childMenus.selectedMenu = 'Playlists'; // set value for breadcrumb is Playlist

      self.songs = []; // Declare array songs
      self.playlists = []; // Declare array playlist

      self.markAll = false;
      self.showSearch = false; // hide or show search box
      self.querySearch = {}; // a string to search

      self.oldPlaylist = {}; // use to edit
      self.newPlaylist = {}; // use to create

      self.checkToShowButtonDelete = false; // disabled button delete all or not
      self.state = ''; // state are manage, create or edit

      self.sortType = ''; // is name column of table, it uses to sort.
      self.sortReverse = false; // sort-asc or sort-desc

      // array column name
      self.column = [
        {name: 'contentWeb.playlists.playlistTable.name', key: 'name', className: 'name-playlist'},
        {name: 'contentWeb.playlists.playlistTable.description', key: 'description', className: 'description-playlist'}];

      // click button search
      self.setIsSearch = function () {
        self.showSearch = true;
        playlistService.setShowSearch(true);
      };

      // click close 'x' of button search
      self.setIsNotSearch = function () {
        self.showSearch = false;
        playlistService.setShowSearch(false);

        self.querySearch.value = '';
        playlistService.setQuerySearch('');
      };

      // ----------------------------------------------------------
      self.changeStateToAdd = function () {
        self.state = 'create';
        self.newPlaylist.songs = [];
        playlistService.setState(self.state, self.newPlaylist); // save for song service
      };

      self.changeStateToManage = function () {
        self.oldPlaylist = {};
        self.newPlaylist = {};

        self.state = '';
        playlistService.setState(self.state, {}); // save for song service
      };

      self.changeStateToEdit = function (playlist) {
        self.oldPlaylist = angular.copy(playlist);
        self.state = 'edit';
        playlistService.setState(self.state, self.oldPlaylist); // save for song service
      };

      //-------------------------------------------------------------
      // Add new playlist
      self.addPlaylistByClick = function (playlist) {
        self.newPlaylist = {};

        playlist.check = false;
        if (typeof playlist.description === 'undefined') {
          playlist.description = 'none';
        }
        playlistService.addPlaylist(playlist);

        self.changeStateToManage();

        getPlayLists();
      };

      // save playlist after finished edit
      self.savePlaylist = function (playlist) {
        self.oldPlaylist = {};
        playlistService.savePlaylist(playlist);
        self.state = '';
        playlistService.setState(self.state, {});

        getPlayLists();
      };

      // add by press enter on keyboard
      self.addPlaylist = function () {
        console.log('Press enter on keyboard!!!');
      };

      // set values for 'checkToShowButtonDelete'
      self.setCheckToShowButtonDelete = function () {
        self.checkToShowButtonDelete = checkToShowButtonDelete();
      };

      // click playlist on table
      self.setChoosePlaylistOnRow = function (playlist, key) {
        if (key === 'click-checkbox') {
          self.setCheckToShowButtonDelete();
        } else {
          self.currentPlaylist = playlist;
          self.beforeState = self.state;
          self.state = 'showSong';
        }
      };

      // button back.
      self.backToState = function (nameState) {
        //console.log(nameState);
        self.state = nameState;
      };

      // Show dialog deletes a playlist
      self.showConfirmDeleteSingle = function (event, playlist) {
        // Appending dialog to document.body to cover sidenav in docs app
        $mdDialog.show({
          targetEvent: event,
          templateUrl: 'scripts/template/delete-single.html',
          locals: {
            playlist: playlist,
            title: 'Delete playlist',
            context: 'Are you sure you want to delete this playlist? '
          },
          controller: dialogControllerForDeleteSingle
        });

      };

      // Show dialog delete multiple playlist
      self.showConfirmDeleteMultiple = function (event) {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
          parent: parentEl,
          targetEvent: event,
          templateUrl: 'scripts/template/delete-multiple.html',
          locals: {
            title: 'Delete Multiple Playlist',
            context: 'Are you sure you want to delete selected playlist? '
          },
          controller: dialogControllerForDeleteMultiple
        });
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

      startPlaylist();

      /**
       * Extend for playlist.js
       */
      playListExtend.decorator($scope, self);
      playListChooseSongs.decorator($scope, self);
    }])
;
