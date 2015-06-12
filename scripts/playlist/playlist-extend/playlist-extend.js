/**
 * Created by thuynghi on 6/5/2015.
 * Extend: Add songs for playlist and show toast
 */
'use strict';

(function () {

  angular.module('musicApp')
    .factory('playListExtend', ['$mdDialog', '$mdToast', function ($mdDialog, $mdToast) {
      return {
        decorator: function ($scope, self) {

          /**
           * Controller of dialog set songs for playlist
           * @param scope
           * @param $mdDialog - a service of material angularJS for Dialog
           * @param songs  - Array songs of web music
           * @param playlist - playlist was selected
           */
          function dialogSetSongForPlaylist(scope, $mdDialog, songs, playlist) {
            scope.songs = songs;

            if (typeof playlist.songs === 'undefined') {
              scope.songsInsidePlaylist = [];
            } else {
              scope.songsInsidePlaylist = angular.copy(playlist.songs);
            }

            // calculate array songs which don't attached this playlist
            function setSongOutSidePlaylist(songs, songsInsidePlaylist) {
              var songsOutsidePlaylist = [];
              for (var i = 0; i < songs.length; i++) {
                var check = false;
                for (var j = 0; j < songsInsidePlaylist.length; j++) {
                  if (songs[i].id === songsInsidePlaylist[j].id) {
                    check = true;
                    break;
                  }
                }
                if (check === false) {
                  songsOutsidePlaylist.push(songs[i]);
                }
              }
              return songsOutsidePlaylist;
            }

            scope.songsOutsidePlaylist = setSongOutSidePlaylist(scope.songs, scope.songsInsidePlaylist);

            scope.closeDialog = function () {
              $mdDialog.hide();
            };

            // Add songs was selected for this playlist
            scope.addSongToPlaylist = function () {
              for (var i = 0; i < scope.songsOutsidePlaylist.length; i++) {
                if (scope.songsOutsidePlaylist[i].select === true) {
                  scope.songsOutsidePlaylist[i].select = false;
                  scope.songsInsidePlaylist.push(scope.songsOutsidePlaylist[i]);
                  scope.songsOutsidePlaylist.splice(i, 1);
                  i--;
                }
              }
            };

            // Remove songs was selected
            scope.removeSongFromPlaylist = function () {
              for (var i = 0; i < scope.songsInsidePlaylist.length; i++) {
                if (scope.songsInsidePlaylist[i].select === true) {
                  scope.songsInsidePlaylist[i].select = false;
                  scope.songsOutsidePlaylist.push(scope.songsInsidePlaylist[i]);
                  scope.songsInsidePlaylist.splice(i, 1);
                  i--;
                }
              }
            };

            // Confirm for dialog set songs for playlist
            scope.comfirmAddAndRemoveSongForPlaylist = function () {
              var listNameSongs = '';
              for (var i = 0; i < scope.songsInsidePlaylist.length; i++) {
                scope.songsInsidePlaylist[i].select = false;
                listNameSongs += scope.songsInsidePlaylist[i].name;
                if (i !== scope.songsInsidePlaylist.length-1) {
                  listNameSongs += ', ';
                }
              }
              playlist.songs = scope.songsInsidePlaylist;
              playlist.listNameSongs = listNameSongs;
              $mdDialog.hide();
            };
          }

          // Show dialog to set songs for a playlist
          self.setSongForPlaylist = function (playlist, $event) {
            var parentEl = angular.element(document.body);
            $mdDialog.show({
              parent: parentEl,
              targetEvent: $event,
              locals: {
                songs: angular.copy(self.songs),
                playlist: playlist
              },
              templateUrl: 'scripts/playlist/select-song/select-songs.html',
              controller: dialogSetSongForPlaylist
            });
          };

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