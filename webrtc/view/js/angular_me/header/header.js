/**
 * Created by xerxes on 3/15/14.
 */
var header = angular.module('headerApp', []);
header.directive('headerDirective', function () {
    return {
        replace: true,
        transclude: true,
        templateUrl: 'html/header.html'
    };
});
header.controller('headerController', function ($scope) {
    $scope.handle_login = function () {
        $scope.need_login = true;
        $.removeCookie('user_token');
    };
});