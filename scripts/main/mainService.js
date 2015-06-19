///**
// * Created by thuynghi on 6/11/2015.
// */
///**
// * Created by Nghi Tran on 6/5/2015.
// * create service for app
// */
//'use strict';
//
//(function () {
//
//  angular.module('musicApp')
//    .service('mainService', [ '$timeout', function ($timeout) {
//      // resize
//      var self = this;
//
//      self.resizeWeb = function () {
//        if (window.innerWidth < 679) {
//          var width = (window.innerWidth - 200) + 'px';
//
//          console.log(width);
//
//          var contentTable = document.getElementsByClassName('content-table');
//          for (var i = 0; i < contentTable.length; i++) {
//            contentTable[i].style.width = width;
//          }
//        } else {
//          var nameSongs = document.querySelectorAll('.content-table.name-song');
//          var artistSong = document.querySelectorAll('.content-table.artist-song');
//
//          var wName = 35 + '%';
//          var wArtist = 25 + '%';
//          for (var j = 0; j < nameSongs.length; j++) {
//            nameSongs[j].style.width = wName;
//            artistSong[j].style.width = wArtist;
//          }
//        }
//
//        //console.log(window.innerHeight);
//
//        $timeout(function() {
//          var heightBody = (window.innerHeight - 360) + 'px';
//          //var heightListSong = (window.innerHeight - 400) + 'px';
//          //var tBody = document.querySelector('table.my-table tbody');
//          var tBody = angular.element('table.my-table tbody');
//          //var listSongInPlaylist = document.getElementsByClassName('my-listSong-in-playlist');
//          tBody.css('height', heightBody);
//          //listSongInPlaylist[0].style.height = heightListSong;
//        });
//
//      };
//    }]);
//})();