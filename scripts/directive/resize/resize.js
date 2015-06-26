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
            if (scope.type === 'w') {
              element.css({
                'max-width': (newValue.w - scope.valueDrop) + 'px'
              });
            } else {
              if (scope.type === 'h') {
                element.css({
                  'max-height': (newValue.h - scope.valueDrop) + 'px'
                });
              } else {
                if (scope.type === 'wh') {
                  element.css({
                    'max-height': (newValue.h - scope.valueDrop) + 'px',
                    'max-width': (newValue.w - scope.valueDrop) + 'px'
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