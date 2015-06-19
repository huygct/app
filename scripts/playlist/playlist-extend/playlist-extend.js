/**
 * Created by thuynghi on 6/5/2015.
 * Extend: Add songs for playlist and show toast
 */
'use strict';

(function () {

  angular.module('musicApp')
    .factory('playListExtend', ['$mdDialog', '$mdToast', '$window', function ($mdDialog, $mdToast, $window) {
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
            // check to show or hide button add and remove
            scope.checkInsidePlaylist = true;
            scope.checkOutsidePlaylist = true;

            if (typeof playlist.songs === 'undefined') {
              scope.songsInsidePlaylist = [];
            } else {
              scope.songsInsidePlaylist = angular.copy(playlist.songs);
            }

            // Check data to set value true or false for markAll
            function setMarkAll(listData) {
              for (var i = 0; i < listData.length; i++) {
                if (listData[i].check === false) {
                  return false;
                }
              }
              return true;
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

            // click checkbox of left side
            scope.clickCheckboxInsidePlaylist = function () {
              for (var i = 0; i < scope.songsInsidePlaylist.length; i++) {
                if(scope.songsInsidePlaylist[i].check === true) {
                  scope.checkInsidePlaylist = false;
                  break;
                } else {
                  scope.checkInsidePlaylist = true;
                }
              }
              scope.selectAllInsidePlaylist = setMarkAll(scope.songsInsidePlaylist);
            };

            // click checkbox of right side
            scope.clickCheckboxOutsidePlaylist = function () {
              for (var i = 0; i < scope.songsOutsidePlaylist.length; i++) {
                if(scope.songsOutsidePlaylist[i].check === true) {
                  scope.checkOutsidePlaylist = false;
                  break;
                } else {
                  scope.checkOutsidePlaylist = true;
                }
              }
              scope.selectAllOutsidePlaylist = setMarkAll(scope.songsOutsidePlaylist);
            };

            // Add songs was selected for this playlist
            scope.addSongToPlaylist = function () {
              for (var i = 0; i < scope.songsOutsidePlaylist.length; i++) {
                if (scope.songsOutsidePlaylist[i].check === true) {
                  scope.songsOutsidePlaylist[i].check = false;
                  scope.songsInsidePlaylist.push(scope.songsOutsidePlaylist[i]);
                  scope.songsOutsidePlaylist.splice(i, 1);
                  i--;
                }
              }

              scope.checkOutsidePlaylist = true;

              scope.selectAllInsidePlaylist = false;
              scope.selectAllOutsidePlaylist = false;
            };

            // Remove songs was selected
            scope.removeSongFromPlaylist = function () {
              for (var i = 0; i < scope.songsInsidePlaylist.length; i++) {
                if (scope.songsInsidePlaylist[i].check === true) {
                  scope.songsInsidePlaylist[i].check = false;
                  scope.songsOutsidePlaylist.push(scope.songsInsidePlaylist[i]);
                  scope.songsInsidePlaylist.splice(i, 1);
                  i--;
                }
              }

              scope.checkInsidePlaylist = true;

              scope.selectAllInsidePlaylist = false;
              scope.selectAllOutsidePlaylist = false;
            };

            // change select all songInsidePlaylist
            scope.changeSelectAllInsidePlaylist = function () {
              for (var i = 0; i < scope.songsInsidePlaylist.length; i++) {
                scope.songsInsidePlaylist[i].check = scope.selectAllInsidePlaylist;
              }
              scope.checkInsidePlaylist = !scope.selectAllInsidePlaylist;
            };

            // change select all songOutsidePlaylist
            scope.changeSelectAllOutsidePlaylist = function () {
              for (var i = 0; i < scope.songsOutsidePlaylist.length; i++) {
                scope.songsOutsidePlaylist[i].check = scope.selectAllOutsidePlaylist;
              }
              scope.checkOutsidePlaylist = !scope.selectAllOutsidePlaylist;
            };

            // Confirm for dialog set songs for playlist
            scope.confirmAddAndRemoveSongForPlaylist = function () {
              var listNameSongs = '';
              for (var i = 0; i < scope.songsInsidePlaylist.length; i++) {
                scope.songsInsidePlaylist[i].check = false;
                listNameSongs += scope.songsInsidePlaylist[i].name;
                if (i !== scope.songsInsidePlaylist.length-1) {
                  listNameSongs += ', ';
                }
              }
              playlist.songs = scope.songsInsidePlaylist;
              playlist.listNameSongs = listNameSongs;

              $mdDialog.hide();
            };

            //why...................................................
            scope.$watch('songsInsidePlaylist', function () {
              console.log('aaaaaaaaaaaaaaaaaaaaaaa');
              //if ($scope.songsInsidePlaylist.length === 0) {
              //  $scope.selectAllInsidePlaylist = false;
              //} else {
              //  for (var i = 0; i < newList.length; i++) {
              //    if(newList[i].check === false) {
              //      $scope.selectAllInsidePlaylist = false;
              //      break;
              //    }
              //  }
              //}
            });
          }

          // Show dialog to set songs for a playlist
          self.setSongForPlaylist = function (playlist, $event) {
            // show dialog to choose songs if width screen > 680
            if ($window.innerWidth >= 680) {
              var parentEl = angular.element(document.body);
              $mdDialog.show({
                parent: parentEl,
                targetEvent: $event,
                locals: {
                  songs: angular.copy(self.songs),
                  playlist: playlist
                },
                templateUrl: 'scripts/playlist/select-song-dialog/select-songs.html',
                controller: dialogSetSongForPlaylist
              });
            } else {
              // when width of screen < 680
              self.state = 'chooseSong';


            }
          };

          // page show songs
          self.showSongsOfPlaylist = function (playlist) {
            self.currentPlaylist = playlist;
            self.beforeState = self.state;
            self.state = 'showSong';
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