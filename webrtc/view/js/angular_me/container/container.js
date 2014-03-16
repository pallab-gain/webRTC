/**
 * Created by xerxes on 3/15/14.
 */
/**
 * Created by xerxes on 3/15/14.
 */
var container = angular.module('containerApp', []);
container.directive('containerDirective', function () {
    return {
        replace: true,
        transclude: true,
        templateUrl: 'html/container.html'
    };
});
container.controller('containerController', function ($scope) {
    $scope.socket = io.connect('http://localhost:9090');
});