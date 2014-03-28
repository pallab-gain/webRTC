/**
 * Created by xerxes on 3/28/14.
 */
var app = angular.module('webrtcApp', []);

app.factory('socket', function ($rootScope) {
    var socket = io.connect('http://localhost/chat');
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    }
});
app.factory('manager', function ($http, $q) {
    var manager = {};
    manager.aboutme =
        function () {
            var d = $q.defer();
            var url = '/me'
            $http({method: 'GET', url: url})
                .success(function (data, status, headers, config) {
                    manager.data = data;
                    d.resolve();
                })
                .error(function (data, status, header, config) {
                    manager.data = data;
                    d.reject();
                })
            return d.promise;
        }
    manager.set_cookie = function (id) {
        $.cookie('user_id', id, {
            expires: 7
        });
    }
    manager.unset_cookie = function () {
        $.removeCookie('user_id');
    }
    manager.get_cookie = function (callback) {
        var id = $.cookie('user_id');
        if (typeof id != 'undefined' && id) {
            return callback(null, id);
        } else {
            return callback('cookie is not set', null);
        }
    }
    return manager;
})
app.controller('webrtcCtrl', function ($scope, socket, manager) {
    socket.on('on_connection', function (soc, args) {
        manager.aboutme().then(function () {
            if (typeof  manager.data.id !== 'undefined') {
                manager.set_cookie(manager.data.id);
                socket.emit('joinroom', manager.data.id);
            } else {
                console.warn('something work with credential');
            }
        });
    });
    socket.on('on_joinroom', function (soc, args) {
        console.log('yeo', args);
    });
    $scope.webrtcCtrl = this;
})