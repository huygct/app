'use strict';

/**
 * @ngdoc function
 * @name musicApp.controller:MainCtrl
 * @description
 * # SongController
 * Controller of the musicApp
 */
angular.module('musicApp')
  .controller('SongController', ['$scope', '$mdSidenav', '$mdDialog', function ($scope, $mdSidenav, $mdDialog) {
    var self = this;
    self.markAll = false;
    self.showSearch = false;

    self.songs = [];
    self.songOld = {};

    self.selected = 'Song';
    self.menuList = ['Song', 'Playlist'];
    self.selectMenu = selectMenu;
    self.state = "";

    function selectMenu(menu) {
      self.selected = menu;
      self.toggleSidenav('left');
    }

    self.toggleSidenav = function (menuId) {
      $mdSidenav(menuId).toggle();
    };

    self.changeStateToAdd = function () {
      self.state = "create";
    };

    self.changeStateToManage = function () {
      self.songOld = {};
      self.state = "";
    };

    self.changeStateToEdit = function (song) {
      self.songOld.name = song.name;
      self.songOld.artist = song.artist;
      self.songOld.id = song.id;
      self.state = "edit";
    }

    self.addSong = function (song) {
      song.id = self.songs.length;
      self.songs.push(song);
      self.changeStateToManage();
    };

    self.saveSong = function (song) {
      self.songOld = {};
      self.songs.splice(song.id, 1, song);
      self.state = "";
    }

    // dialog
    self.showConfirmDeleteSingle = function (ev, song) {
      // Appending dialog to document.body to cover sidenav in docs app
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: ev,
        template: '<md-dialog aria-label="List dialog">' +
        '  <md-dialog-content>' +
        '       <h2 class="md-title">Delete Song </h2>' +
        '       <p>Are you sure you want to delete this song? </p>' +
        '  </md-dialog-content>' +
        '  <div class="md-actions">' +
        '    <md-button ng-click="comfirmDelete()" class="md-primary">' +
        '      Yes' +
        '    </md-button>' +
        '    <md-button ng-click="closeDialog()" class="md-primary">' +
        '      No' +
        '    </md-button>' +
        '  </div>' +
        '</md-dialog>',
        locals: {
          items: song
        },
        controller: DialogController
      });
      function DialogController(scope, $mdDialog, items) {
        scope.items = items;
        scope.closeDialog = function () {
          $mdDialog.hide();
        }
        scope.comfirmDelete = function () {
          //console.log(song.id);
          self.songs.splice(song.id, 1);
          _setIndexes();
          self.state = "";
          $mdDialog.hide();
        }
      }
    };

    self.showConfirmDeleteMultiple = function (ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: ev,
        template: '<md-dialog aria-label="List dialog">' +
        '  <md-dialog-content>' +
        '       <h2 class="md-title">Delete Multiple Songs </h2>' +
        '       <p>Are you sure you want to delete selected songs? </p>' +
        '  </md-dialog-content>' +
        '  <div class="md-actions">' +
        '    <md-button ng-click="comfirmDeleteAll()" class="md-primary">' +
        '      Yes' +
        '    </md-button>' +
        '    <md-button ng-click="closeDialog()" class="md-primary">' +
        '      No' +
        '    </md-button>' +
        '  </div>' +
        '</md-dialog>',
        controller: DialogController
      });
      function DialogController(scope, $mdDialog) {
        scope.closeDialog = function () {
          $mdDialog.hide();
        }
        scope.comfirmDeleteAll = function () {
          var oldSongs = self.songs;
          self.songs = [];
          angular.forEach(oldSongs, function (song) {
            if (!song.check) {
              self.songs.push(song);
            }
          });

          _setIndexes();
          self.state = "";
          self.markAll = false;
          $mdDialog.hide();
        }
      }
    };

    self.toggleMarkAll = function () {
      angular.forEach(self.songs, function (song) {
        song.check = self.markAll;
      });
    };

    self.setIsSearch = function () {
      self.showSearch = true;
    };

    self.setIsNotSearch = function () {
      self.showSearch = false;
    };

    function _setIndexes() {
      self.songs.forEach(function (song, index) {
        song.id = index;
      });
    }
  }]);
