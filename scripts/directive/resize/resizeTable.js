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
          'type': '@type',
          valueDrop: '@valueDrop'
        },

        link: function (scope, element) {
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
              //if (scope.type === 'song') {
              if (newValue.width < 679) {
                var width = (newValue.width - 200) + 'px';

                var contentTable = document.getElementsByClassName('content-table');
                for (var i = 0; i < contentTable.length; i++) {
                  contentTable[i].style.width = width;
                }
              }
              else {
                var nameSongs = document.querySelectorAll('.content-table.name-song');
                var artistSong = document.querySelectorAll('.content-table.artist-song');

                var wName = 35 + '%';
                var wArtist = 25 + '%';
                for (var j = 0; j < nameSongs.length; j++) {
                  nameSongs[j].style.width = wName;
                  artistSong[j].style.width = wArtist;
                }
              }
              //} else {
              //  if (scope.type === 'playlist') {

              //}
              //}

              var heightBody = (window.innerHeight - 360) + 'px';
              //var heightListSong = (window.innerHeight - 400) + 'px';
              //var tBody = document.querySelector('table.my-table tbody');
              var tBody = angular.element('table.my-table tbody');
              //var listSongInPlaylist = document.getElementsByClassName('my-listSong-in-playlist');
              tBody.css('height', heightBody);
              //listSongInPlaylist[0].style.height = heightListSong;
            });



            //if (scope.type === 'width') {
            //  element.css({
            //    'width': (newValue.width - 50) + 'px'
            //  });
            //} else {
            //  if (scope.type === 'height') {
            //    element.css({
            //      'height': (newValue.height - 400) + 'px'
            //    });
            //  } else {
            //    if (scope.type === 'width-height') {
            //      element.css({
            //        'height': (newValue.height - 50) + 'px',
            //        'width': (newValue.width - 50) + 'px'
            //      });
            //    }
            //  }
            //}

          }, true);
          console.log('bind this!');

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