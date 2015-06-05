/**
 * Created on 6/4/2015.
 * directive task
 */
'use strict';
(function () {
    angular.module('musicApp')
        .directive('myTask', [function () {
            var directive = {};
            directive.require = '^mySearch';
            directive.restrict = 'EA';

            directive.scope = {
                songs: '=',
                querySearch: '=',
                showEdit: '&',
                showDelete: '&'
            };
            directive.templateUrl = 'scripts/directive/task/my-task.html';
            directive.controller = ['$scope', function ($scope) {
                $scope.abc = '';
            }];
            directive.controllerAs = 'searchCtrl';
            directive.link = function (scope, element, attrs, searchCtrl) {

            };
            return directive;
        }]);
})();