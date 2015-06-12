/**
 * Created on 6/4/2015.
 * Directive for table
 * input:
 *  1. listData: data
 *  2. nameTable: name of table
 *  3. column: array column that include column name
 *  4. querySearch: two data binding with query, use to search
 *  5. whenClickButtonEdit: event when click button edit on table
 *  6. whenClickButtonDelete: event when click button delete on table
 *  7. whenSelectItemOfTable: event when select a row of table
 *  8. showToast: show toast when select a row
 */
'use strict';
(function () {
  angular.module('musicApp')
    .directive('myTable', ['$mdDialog', function ($mdDialog) {
      var directive = {};
      directive.restrict = 'EA';
      directive.scope = {
        listData: '=',
        nameTable: '@',
        column: '=',
        querySearch: '=',
        whenClickButtonEdit: '&',
        whenClickButtonDelete: '&',
        whenSelectItemOfTable: '&',
        showToast: '&'
      };
      directive.templateUrl = 'scripts/directive/table/my-table.html';
      directive.controller = ['$scope', function ($scope) {
        $scope.markAll = false; // Declare markAll, give it the value of checkbox on header of table

        // function to edit data of table
        $scope.editData = function (data) {
          $scope.whenClickButtonEdit({data: data});
        };

        /**
         * Delete a row (a item of data)
         * @param $event use to show dialog
         * @param data that will be delete
         */
        $scope.deleteItemFromTable = function ($event, data) {
          $scope.whenClickButtonDelete({
            $event: $event,
            data: data
          });
        };

        // Selection all row
        $scope.toggleMarkAll = function () {
          angular.forEach($scope.listData, function (data) {
            data.check = $scope.markAll;
          });
          $scope.whenSelectItemOfTable();
        };

        // Check data to set value true or false for markAll
        function setMarkAll () {
          for (var i = 0; i < $scope.listData.length; i++) {
            if ($scope.listData[i].check === false) {
              $scope.markAll = false;
              return;
            }
          }
          $scope.markAll = true;
        }

        // When select checkbox on row of table
        $scope.clickCheckbox = function () {
          //console.log('clickCheckbox');
          setMarkAll();
          $scope.whenSelectItemOfTable();
        };

        // Make for fun. run a item of data
        function dialogRunData (scope, $mdDialog, data) {
          scope.url = 'data/song/' + data.url;
          scope.title = data.name;

          console.log(scope.url);

          scope.closeDialog = function () {
            $mdDialog.hide();
          };
          scope.run = function () {

          };
        }

        $scope.runData = function (data, $event) {
          //console.log(data);
          var parentEl = angular.element(document.body);
          $mdDialog.show({
            parent: parentEl,
            targetEvent: $event,
            locals: {
              data: data
            },
            templateUrl: 'scripts/directive/table/run-data.html',
            controller: dialogRunData
          });
        };

        // when select a row
        $scope.setChooseRow = function (data, $event) {
          //console.log('setChooseRow');
          if ($event.shiftKey) {
            //if (self.chooseBeforeSong.check === true) {
            //    var songId = self.chooseBeforeSong.id;
            //    if (songId < song.id) {
            //        for (var i = songId; i <= song.id; i++) {
            //                self.songs[i].check = true;
            //            }
            //        }
            //    }
          } else {
            if ($event.ctrlKey) {
              // press ctrl
              data.check = !data.check;
            } else {
              for (var i = 0; i < $scope.listData.length; i++) {
                if ($scope.listData[i].id === data.id) {
                  $scope.listData[i].check = !data.check;
                } else {
                  $scope.listData[i].check = false;
                }
              }
            }
          }

          setMarkAll();
          $scope.whenSelectItemOfTable({
            data: data
          });


          // show toast
          //$scope.showToast({
          //  data: data
          //});
        };
      }];
      directive.controllerAs = 'searchCtrl';
      directive.compile = function () {
        // do one-time configuration of element.

        var linkFunction = function ($scope) {
          // bind element to data in $scope

          // set markAll is false when data.length is 0
          $scope.$watch('listData', function (newData) {
            if(newData.length === 0) {
              $scope.markAll = false;
            }
          });
        };

        return linkFunction;
      };
      return directive;
    }]);
})();


//<my-table table-formal="playlistCtrl.tableStyle" link-data="playlistCtrl.link"></my-table>
