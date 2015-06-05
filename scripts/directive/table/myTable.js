/**
 * Created on 6/4/2015.
 * directive table
 */
'use strict';
(function () {
    angular.module('musicApp')
        .directive('myTable', ['playlistService', function (playlistService) {
            var directive = {};
            directive.restrict = 'EA';
            directive.scope = {
                listData: '=',
                nameTable: '@',
                column: '=',
                querySearch: '=',
                state: '=',
                addData: '&',
                showEdit: '&',
                showDelete: '&'
            };
            directive.templateUrl = 'scripts/directive/table/my-table.html';
            directive.controller = ['$scope', function ($scope) {
                $scope.markAll = false;
                $scope.checkToShowButtonDelete = false;

                $scope.editData = function (data) {
                    $scope.showEdit({data: data});
                };

                $scope.toggleMarkAll = function () {
                    angular.forEach($scope.listData, function (data) {
                        data.check = $scope.markAll;
                    });
                    $scope.checkToShowButtonDelete = checkToShowButtonDelete(); // check status of button delete
                };

                // set value for 'checkToShowButtonDelete'
                $scope.setCheckToShowButtonDelete = function () {
                    $scope.checkToShowButtonDelete = checkToShowButtonDelete();
                };

                // calculate value of 'checkToShowButtonDelete'
                function checkToShowButtonDelete() {
                    for (var i = 0; i < $scope.listData.length; i++) {
                        if ($scope.listData[i].check === true) {
                            return true;
                        }
                    }
                    return false;
                }

                $scope.setChooseRow = function (data, $event) {

                    console.log($event.ctrlKey);


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


                    $scope.markAll = false;
                    // self.chooseBeforeSong = song;
                    $scope.checkToShowButtonDelete = checkToShowButtonDelete(); // check status of button delete
                };
            }];
            directive.controllerAs = 'searchCtrl';
            directive.compile = function(element, attributes) {
                // do one-time configuration of element.

                var linkFunction = function($scope, element, atttributes) {
                    // bind element to data in $scope

                };

                return linkFunction;
            };
            return directive;
        }]);
})();


//<my-table table-formal="playlistCtrl.tableStyle" link-data="playlistCtrl.link"></my-table>