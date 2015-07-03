'use strict';
(function () {
  angular.module('musicApp')
    .service('animalService', ['$http', '$q', function ($http, $q) {

      var self = this;

      self.cache = {
        checkedAll: false,
        animals: [],
        gotData: false
      };

      // Check data to set value true or false for markAll
      function setMarkAll(animals) {
        for (var i = 0; i < animals.length; i++) {
          if (animals[i].checked === false) {
            self.cache.checkedAll = false;
            return;
          }
        }
        self.cache.checkedAll = true;
      }

      self.setCheckboxOfHeader = function () {
        setMarkAll(self.cache.animals);
      };

      self.getValueOfHeaderCheckbox = function () {
        return self.cache.checkedAll;
      };

      self.setCheckAllAnimals = function (checkedAll) {
        for(var i = 0; i < self.cache.animals.length; i++) {
          self.cache.animals[i].checked = checkedAll;
        }
      };

      self.toggleCheckedAnimal = function () {
        setMarkAll(self.cache.animals);
      };

      self.getListAnimals = function () {
        var deferred = $q.defer();

        if (self.cache.gotData) {
          deferred.resolve(self.cache.animals);
        } else {
          $http.get('data/animal.json')
            .success(function (response) {
              self.cache.gotData = true;
              self.cache.animals = response;
              deferred.resolve(self.cache.animals);
            })
            .error(function (response) {
              deferred.reject(response);
            });
        }
        return deferred.promise;
      };
    }]);
})();