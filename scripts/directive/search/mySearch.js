/**
 * Created by thuynghi on 6/4/2015.
 */
'use strict';

(function () {
    angular.module('musicApp')
        .directive('mySearch', [function () {
            var directive = {};
            directive.restrict = 'EA';
            directive.scope = {
                ngModel: '=',
                close: '&'
            };
            directive.templateUrl = 'scripts/directive/search/my-search.html';
            return directive;
        }]);
})();