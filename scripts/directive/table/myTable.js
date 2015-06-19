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
      directive.controller = [function () {
        var self = this;
        self.markAll = false; // Declare markAll, give it the value of checkbox on header of table

        // function to edit data of table
        self.editData = function (data) {
          self.whenClickButtonEdit({data: data});
        };

        /**
         * Delete a row (a item of data)
         * @param $event use to show dialog
         * @param data that will be delete
         */
        self.deleteItemFromTable = function ($event, data) {
          self.whenClickButtonDelete({
            $event: $event,
            data: data
          });
        };

        // Selection all row
        self.toggleMarkAll = function () {
          angular.forEach(self.listData, function (data) {
            data.check = self.markAll;
          });
          self.whenSelectItemOfTable({
            data: {},
            key: 'click-checkbox'
          });
        };

        // Check data to set value true or false for markAll
        function setMarkAll() {
          for (var i = 0; i < self.listData.length; i++) {
            if (self.listData[i].check === false) {
              self.markAll = false;
              return;
            }
          }
          self.markAll = true;
        }

        // When select checkbox on row of table
        self.clickCheckbox = function (data) {
          //console.log('clickCheckbox');
          setMarkAll();

          self.whenSelectItemOfTable({
            data: data,
            key: 'click-checkbox'
          });
        };

        // Make for fun. run a item of data
        function dialogRunData(scope, $mdDialog, data) {
          scope.url = 'data/song/' + data.url;
          scope.title = data.name;

          console.log(scope.url);

          scope.closeDialog = function () {
            $mdDialog.hide();
          };
          scope.run = function () {

          };
        }

        self.runData = function (data, $event) {
          //console.log(data);
          if (self.nameTable === 'Song') { // only active when table-name is song
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
          } else {
            console.log('It is not a song');
          }
        };

        // when select a row
        self.setChooseRow = function (data, $event) {
          //console.log('setChooseRow');
          if (self.nameTable === 'Song') { // only active when table-name is song
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
                for (var i = 0; i < self.listData.length; i++) {
                  if (self.listData[i].id === data.id) {
                    self.listData[i].check = !data.check;
                  } else {
                    self.listData[i].check = false;
                  }
                }
              }
            }
            setMarkAll();
          }
          self.whenSelectItemOfTable({
            data: data
          });
          // show toast
          //self.showToast({
          //  data: data
          //});
        };
      }];
      directive.controllerAs = 'tableCtrl';
      directive.bindToController = true;
      directive.compile = function () {
        // do one-time configuration of element.

        var linkFunction = function ($scope) {
          // bind element to data in $scope

          // set markAll is false when data.length is 0
          $scope.$watch('tableCtrl.listData', function (newData) {
            if (newData.length === 0) {
              $scope.tableCtrl.markAll = false;
            } else {
              for (var i = 0; i < $scope.tableCtrl.listData.length; i++) {
                if ($scope.tableCtrl.listData[i].check === false) {
                  $scope.tableCtrl.markAll = false;
                  return;
                }
              }
              $scope.tableCtrl.markAll = true;
            }
          });
        };

        return linkFunction;
      };
      return directive;
    }]);
})();


//<my-table table-formal="playlistCtrl.tableStyle" link-data="playlistCtrl.link"></my-table>
