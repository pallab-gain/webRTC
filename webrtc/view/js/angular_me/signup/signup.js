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
signup.factory('User', function ($http, $q) {
    var User = {};

    User.check_valid_user = function (phn, pass) {
        var dfr = $q.defer();
        var url = '/check-valid-user'
        $http({method: 'POST', url: url, data: {phone: phn, password: pass}})
            .success(function (data, status, headers, config) {
                User.data = data;
                dfr.resolve();
            })
            .error(function (data, status, headers, config) {
                User.data = data;
                dfr.resolve();
            })
        return dfr.promise;
    }

    User.sign_up_user = function (phn, pass) {
        var dfr = $q.defer();
        var url = '/sign-up-user'
        $http({method: 'POST', url: url, data: {phone: phn, password: pass}})
            .success(function (data, status, headers, config) {
                User.data = data;
                dfr.resolve();
            })
            .error(function (data, status, headers, config) {
                User.data = data;
                dfr.resolve();
            })
        return dfr.promise;
    }
    User.set_cookies = function (options, timespan) {
        if (typeof timespan == 'undefined') {
            $.cookie("user_token", options.user_token);
        } else {
            $.cookie('user_token', options.user_token, {expires: timespan});
        }
    }
    return User;
});
signup.controller('signupController', function ($scope, User) {
    $scope.on_signin = function (phn, pass, rem) {
        $scope.need_login = !$scope.need_login;
        User.check_valid_user(phn, pass).then(function () {
            if (User.data.status == true) {
                if (typeof rem != 'undefined' && rem == true)
                    User.set_cookies(User.data.data, 5);
                else {
                    User.set_cookies(User.data.data);
                }
            }
        });
    };
    $scope.on_signup = function (phn, pass) {
        User.sign_up_user(phn, pass).then(function () {
            console.log(User.data);
        });
    };
});