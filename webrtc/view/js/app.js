/**
 * Created by xerxes on 3/15/14.
 */
var webrtcApp = angular.module('webrtcApp', ['headerApp', 'signupApp', 'containerApp']);

webrtcApp.factory('checkCredential', function () {
    var checkCredential = {};
    checkCredential.is_loggedin = function () {
        var user_token = $.cookie("user_token");
        return (typeof  user_token == 'undefined') ? true : false;
    };
    return checkCredential;
});

webrtcApp.controller('mainController', function ($scope, checkCredential) {
    $scope.need_login = checkCredential.is_loggedin();
    $scope.socket = io.connect('http://localhost:9090');

    $scope.$watch('need_login', function () {
        if ($scope.need_login == false) {

        }
    });
});