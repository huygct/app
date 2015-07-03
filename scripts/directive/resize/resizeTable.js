/**
 * Created by Nghi Tran on 18/06/2015.
 *  */
'use strict';

(function () {
  angular.module('musicApp')
    .directive('resizeTable', ['$window', '$timeout', function ($window, $timeout) {
      return {
        restrict: 'A',
        scope: {
          type: '@type',
          valueDrop: '@valueDrop'
        },

        link: function (scope) {
          var w = angular.element($window);

          //console.log(w); // memory leak

          scope.getWindowDimensions = function () {
            return {
              'height': w.height(),
              'width': w.width()
            };
          };
          scope.$watch(scope.getWindowDimensions, function (newValue) {
            scope.windowHeight = newValue.height;
            scope.windowWidth = newValue.width;

            $timeout(function () {
              var heightBody = window.innerHeight - 384;
              var tBody = angular.element('table.my-table tbody');

              if (newValue.width < 700) {
                var width = (newValue.width - 220) + 'px';

                var contentTable = document.getElementsByClassName('content-table');
                for (var i = 0; i < contentTable.length; i++) {
                  contentTable[i].style.width = width;
                }
              }
              else {
                var actionTable = document.querySelectorAll('.action-col.button-in-action-col');
                //console.log(scope.type);
                if (scope.type === 'Song') {
                  var nameSongs = document.querySelectorAll('.content-table.name-song');
                  var artistSong = document.querySelectorAll('.content-table.artist-song');

                  var wName = 35 + '%';
                  var wArtist = 25 + '%';

                  for (var j = 0; j < nameSongs.length; j++) {
                    nameSongs[j].style.width = wName;
                    artistSong[j].style.width = wArtist;
                    if (tBody[0].clientHeight > heightBody) {
                      // appear scroll bar
                      artistSong[j].style.paddingLeft = '8px';
                      actionTable[j].style.paddingLeft = '8px';
                    }
                  }
                } else {
                  var descriptionPlist = document.querySelectorAll('.content-table.description-playlist');

                  for (var x = 0; x < descriptionPlist.length; x++) {
                    if (tBody[0].clientHeight > heightBody) {
                      // appear scroll bar
                      descriptionPlist[x].style.paddingLeft = '8px';
                      actionTable[x].style.paddingLeft = '8px';
                    }
                  }
                }
              }

              tBody.css('max-height', heightBody + 'px');

            });
          }, true);
          //console.log('bind this!');

          function applyChanges() {
            scope.$apply();
          }

          w.bind('resize.elmResize', applyChanges);

          scope.$on('$destroy', function () {
            w.unbind('resize.elmResize', applyChanges);
          });
        }
      };
    }]);
})();