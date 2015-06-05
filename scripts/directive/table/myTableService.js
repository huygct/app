/**
 * Created by thuynghi on 6/5/2015.
 */
/**
 * Created by thuynghi on 6/5/2015.
 */
'use strict';

(function () {

    angular.module('musicApp')
        .service('myTableService', ['$http', '$q', function ($http, $q) {

            var isGetData = false;
            var self = this;

            var listData = [];

            self.getListData = function () {
                var deferred = $q.defer();
                if(isGetData === true) {
                    deferred.resolve(listData);
                } else {
                    $http.get('data/data.json')
                        .success(function (response) {
                            isGetData = true;
                            listData = response;
                            deferred.resolve(response);
                        })
                        .error(function (response) {
                            deferred.reject(response);
                        });
                }
                return deferred.promise;
            };

            self.getPlaylist = function (_id) {
                return findPlaylistById(listData, _id);
            };

            self.addPlaylist = function (data) {
                if (listData.length !== 0) {
                    data.id = listData[listData.length - 1].id + 1;
                    data.check = false;
                    listData.push(data);
                } else {
                    data.id = 0;
                    data.check = false;
                    listData.push(data);
                }
            };


            function findPlaylistById (listData, _id) {
                for (var i = 0; i < listData.length; i++) {
                    if(listData[i].id === _id) {
                        return listData[i];
                    }
                }
                throw new Error('Couldn\'t find object with id: ' + _id);
            }
        }]);

})();