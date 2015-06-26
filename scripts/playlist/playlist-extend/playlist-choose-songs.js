/**
 * Created by thuynghi on 6/24/2015.
 */
/**
 * Created by Nghi Tran on 6/23/2015.
 * Extend: For template: 'choose-song-for-playlist'
 */
'use strict';

(function () {

  angular.module('musicApp')
    .factory('playListChooseSongs', ['$mdToast', function ($mdToast) {
      return {
        decorator: function ($scope, self) {

          var NOT_FOUND;
          NOT_FOUND = -1;

          function findObjectIdx(id, objects) {
            for (var i = 0; i < objects.length; i++) {
              if (objects[i].id === id) {
                return i;
              }
            }
            return NOT_FOUND;
          }

          function findObjectAndPerformAction(id, objects, actionCallback) {
            var index = findObjectIdx(id, objects);

            if (index !== NOT_FOUND) {
              actionCallback(index);
            } else {
              return NOT_FOUND;
            }
          }

          // find value for checkbox all songs
          function setValueForCheckboxSelectedAllSongs(listSong) {
            for (var i = 0; i < listSong.length; i++) {
              if (listSong[i].check === false) {
                self.selectedAllSongs = false;
                return;
              }
            }
            self.selectedAllSongs = true;
          }

          // Choose songs for a playlist
          self.setSongForPlaylistWithPage = function (playlist) {
            self.beforeState = self.state;
            self.state = 'chooseSong';

            self.numberSelectedSongs = playlist.songs.length;
            self.allSongCopy = angular.copy(self.songs);

            // check songs with idx
            function makeActionCallback() {
              return function (idx) {
                self.allSongCopy[idx].check = true;
              };
            }
            for (var i = 0; i < playlist.songs.length; i++) {
              findObjectAndPerformAction(playlist.songs[i].id, self.allSongCopy, makeActionCallback());
            }

          };

          // click checkbox add all song on page choose-song-for-playlist
          self.clickCheckboxSelectedAllSongsOnPageChooseSongs = function () {
            for (var i = 0; i < self.allSongCopy.length; i++) {
              self.allSongCopy[i].check = self.selectedAllSongs;
            }
            if (self.selectedAllSongs) {
              self.numberSelectedSongs = self.allSongCopy.length;
            } else {
              self.numberSelectedSongs = 0;
            }
          };

          // click checkbox to selected a song in list songs
          self.clickCheckboxOfSongOnPageChooseSongs = function (value) {
            if (value) {
              self.numberSelectedSongs++;
            } else {
              self.numberSelectedSongs--;
            }
            setValueForCheckboxSelectedAllSongs(self.allSongCopy);
          };

          // $watch to check array allSongCopy
          $scope.$watch('playlistCtrl.allSongCopy', function (newArray) {
            if (typeof newArray === 'undefined' || newArray.length === 0) {
              self.selectedAllSongs = false;
            } else {
              setValueForCheckboxSelectedAllSongs(newArray);
            }
          });

          // click button apply on page choose-song-for-playlist
          self.applyChooseSongs = function (nameState, songs) {
            var listSongChoosed = [];
            // choose song which check of it is true
            for (var i = 0; i < songs.length; i++) {
              if (songs[i].check) {
                listSongChoosed.push(songs[i]);
              }
            }
            if (nameState === 'create') {
              self.newPlaylist.songs = listSongChoosed;
            } else {
              if (nameState === 'edit') {
                self.oldPlaylist.songs = listSongChoosed;
              }
            }
            self.state = nameState;
            self.allSongCopy = [];
          };

          // click button cancel on page choose-song-for-playlist
          self.cancelChooseSongs = function (nameState) {
            self.state = nameState;
            self.allSongCopy = [];
          };

          // page show songs
          self.showSongsOfPlaylist = function (playlist) {
            self.currentPlaylist = playlist;
            self.beforeState = self.state;
            self.state = 'showSong';
          };

          //----------------------------------------------------------Toast
          // Position to show toast
          self.toastPosition = {
            bottom: true,
            top: false,
            left: false,
            right: true
          };

          // get position of toast
          self.getToastPosition = function () {
            return Object.keys(self.toastPosition)
              .filter(function (pos) {
                return self.toastPosition[pos];
              })
              .join(' ');
          };

          // show songs of playlist by toast
          self.showSongsByToast = function (playlist) {
            var context = '';
            for (var i = 0; i < playlist.songs.length; i++) {
              context += playlist.songs[i].name;
              context += ', ';
            }
            if (context === '') {
              context = 'This playlist don\'t have any the song!!!';
            }
            $mdToast.show(
              $mdToast.simple()
                .content(context)
                .position(self.getToastPosition())
                .hideDelay(3000)
            );
          };
        }
      };
    }]);

})();