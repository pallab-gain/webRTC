/**
 * Created by xerxes on 3/15/14.
 */
var webrtcApp = angular.module('webrtcApp', ['headerApp', 'signupApp']);

webrtcApp.controller('mainController', function ($scope) {
    $scope.need_login = false;
});