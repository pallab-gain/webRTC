/**
 * Created by xerxes on 3/15/14.
 */
var signup = angular.module('signupApp', []);

signup.directive('signupDirective', function () {
    return {
        replace: true,
        transclude: true,
        templateUrl: 'html/signup.html'
    };
});

signup.controller('signupController', function ($scope) {
    $scope.on_signin = function () {
        console.log('on sign in');
        $scope.need_login = !$scope.need_login;
    }
});