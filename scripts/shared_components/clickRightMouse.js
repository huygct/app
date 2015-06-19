/**
 * Created by thuynghi on 6/18/2015.
 */
/**
 * Created by Nghi Tran on 6/5/2015.
 */
'use strict';

(function () {
  angular.module('myRightClick', [])
    .directive('ngRightClick', ['$parse', function ($parse) {
      return function (scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function (event) {
          scope.$apply(function () {
            event.preventDefault();
            fn(scope, {$event: event});
          });
        });
      };
    }])
})();