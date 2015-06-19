/**
 * Created by Nghi Tran on 6/4/2015.
 * create directive mySearch to action search on web
 * input: data for search and action when click button close
 */
'use strict';

(function () {
  angular.module('musicApp')
    .directive('resize', ['$window', function ($window) {
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
              'h': w.height(),
              'w': w.width()
            };
          };
          scope.$watch(scope.getWindowDimensions, function (newValue) {
            //console.log(newValue.h);
            //console.log(newValue.w);

            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            if (scope.type === 'w') {
              element.css({
                'width': (newValue.w - 50) + 'px'
              });
            } else {
              if (scope.type === 'h') {
                element.css({
                  'height': (newValue.h - scope.valueDrop) + 'px'
                });
              } else {
                if (scope.type === 'wh') {
                  element.css({
                    'height': (newValue.h - 50) + 'px',
                    'width': (newValue.w - 50) + 'px'
                  });
                }
              }
            }

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