/**
 * Created by xerxes on 3/15/14.
 */
var webrtcApp = angular.module('webrtcApp', ['headerApp', 'signupApp', 'containerApp']);

webrtcApp.factory('checkCredential', function ($http, $q) {
    var checkCredential = {};
    checkCredential.is_loggedin = function () {
        var user_token = $.cookie("user_token");
        return (typeof  user_token == 'undefined') ? true : false;
    };
    checkCredential.get_user = function (token_id) {
        var d = $q.defer();
        var url = '/get_user_info';
        $http({method: 'POST', url: url, data: {token_id: token_id}})
            .success(function (data, status, headers, config) {
                checkCredential.user = data;
                d.resolve();
            })
            .error(function (data, status, headers, config) {
                checkCredential.user = data;
                d.resolve();
            })
        return d.promise;
    }
    return checkCredential;
});


webrtcApp.controller('mainController', function ($scope, checkCredential) {
    $scope.need_login = checkCredential.is_loggedin();
    $scope.socket = io.connect('http://localhost:9090');

    $scope.$watch('need_login', function () {
        if ($scope.need_login == false) {
            //a user and logged in
            //give him a room and set him online
            var options = { room_id: $.cookie('user_token') };
            join_room($scope.socket,options);
        }
    });
});