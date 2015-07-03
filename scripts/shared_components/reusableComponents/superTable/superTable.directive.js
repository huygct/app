/**
 * Directive for table
 */
'use strict';
(function () {
  //var map = {
  //  'ngClick': ['asdasd', function(asdasd){}],
  //  'module.asd.asdasd': [],
  //  'com.tma.reusableComponents': []
  //};
  //map[key] = value;
  //var module = map[key];
  //var module = map['com.tma.reusableComponents'];

  var module = angular.module('com.tma.reusableComponents');
  module.directive('superTable', [/*'$compile', */function (/*$compile*/) {

    function SuperTableController () {
      var self = this;
      self.getExternalScope = function () {
        return self.tableOptions.externalScope;
      };
    }
    SuperTableController.$inject = [];

    function linkFn(/*$scope, element*/) {
    }

    return {
      restrict: 'EA',
      scope: {
        tableOptions: '='
      },
      templateUrl: 'scripts/shared_components/reusableComponents/superTable/template/superTable.html',
      controller: SuperTableController,
      controllerAs: 'superTableCtrl',
      bindToController : true,
      link: linkFn
    };


  }]);
})();
