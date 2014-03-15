/**
 * Created by xerxes on 3/15/14.
 */
var webrtcApp = angular.module('webrtcApp', ['ngCookies', 'headerApp', 'signupApp']);

webrtcApp.factory('checkCredential', function ($cookieStore) {
    var checkCredential = {};
    checkCredential.is_loggedin = function () {
        return $cookieStore.get('user_token') ? true : false;
    };
    return checkCredential;
});

webrtcApp.controller('mainController', function ($scope, checkCredential) {
    $scope.need_login = checkCredential.is_loggedin();

});