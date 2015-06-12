'use strict';

/**
 * @ngdoc function
 * @name musicApp
 * @description
 * # PlaylistController
 */
angular.module('musicApp')
  .controller('PlaylistController', ['playlistService', 'songService', 'playListExtend', '$scope', '$mdDialog',
    function (playlistService, songService, playListExtend, $scope, $mdDialog) {
      // it is cheat about memory aria of $scope.menus :)
      $scope.childmenus = $scope.menus;
      $scope.childmenus.selectedMenu = 'Playlist'; // set value for breadcrumb is Playlist

      var self = this;
      self.songs = []; // Declare array songs
      self.playlists = []; // Declare array playlist

      //self.markAll = false;
      self.showSearch = false; // hide or show search box
      self.querySearch = {}; // a string to search

      self.oldPlaylist = {}; // use to edit
      self.newPlaylist = {}; // use to create

      self.checkToShowButtonDelete = false; // disabled button delete all or not
      self.state = ''; // state are manage, create or edit

      // array column name
      self.column = [
        {name: 'Name', key: 'name', className: 'name-playlist'},
        {name: 'Description ', key: 'description', className: 'description-playlist'}];

      // click button search
      self.setIsSearch = function () {
        self.showSearch = true;
        playlistService.setShowSearch(true);
      };

      // click close 'x' of button search
      self.setIsNotSearch = function () {
        self.showSearch = false;
        songService.setShowSearch(false);

        self.querySearch.value = '';
        playlistService.setQuerySearch('');
      };

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
        //self.oldPlaylist.name = playlist.name;
        //self.oldPlaylist.description = playlist.description;
        //self.oldPlaylist.songs = playlist.songs;
        //self.oldPlaylist.id = playlist.id;
        self.oldPlaylist = playlist;
        self.state = 'edit';
        playlistService.setState(self.state, self.oldPlaylist); // save for song service
      };

      //-------------------------------------------------------------
      // Add new playlist
      self.addPlaylistByClick = function (playlist) {
        self.newPlaylist = {};
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

      // add by press enter on keyboard
      self.addPlaylist = function () {
        console.log('Press enter on keyboard!!!');
      };

      // set values for 'checkToShowButtonDelete'
      self.setCheckToShowButtonDelete = function () {
        self.checkToShowButtonDelete = checkToShowButtonDelete();
      };














      self.pageSongs = false;
      self.setChoosePlaylistOnRow = function (data) {
        self.setCheckToShowButtonDelete();
        self.currentPlaylist = data;
        self.pageSongs = true;
      };

      self.backToMangePlaylist = function () {
        self.pageSongs = false;
      };


















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
        //scope.playlist = playlist;
        scope.title = title;
        scope.context = context;
        scope.closeDialog = function () {
          $mdDialog.hide();
        };
        scope.comfirmDelete = function () {
          //console.log(song.id);
          //self.songs.splice(song.id, 1);
          playlistService.deleteOnePlaylist(playlist.id);

          self.state = '';
          playlistService.setState(self.state, {}); // save for playlist service
          getPlayLists();

          self.checkToShowButtonDelete = checkToShowButtonDelete(); // check status of button delete
          $mdDialog.hide();
        };
      }

      // Show dialog deletes a playlist
      self.showConfirmDeleteSingle = function (event, playlist) {
        // Appending dialog to document.body to cover sidenav in docs app
        var parentEl = angular.element(document.body);
        $mdDialog.show({
          parent: parentEl,
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

      // get songs from service
      function getListSong() {
        songService.getListSong()
          .then(function successCallback(data) {
            self.songs = data;
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

      startPlaylist();

      /**
       * Extend for playlist.js
       */
      playListExtend.decorator($scope, self);
    }])
;
