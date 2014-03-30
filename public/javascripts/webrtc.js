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
    manager.aboutme = function () {
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
    manager.onlinebuddy = function () {
        var d = $q.defer();
        var url = '/onlinebuddy'
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
            expires: 7 //expire in 7 days
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
        if (args['0'].status == true) {
            console.log('successfully connected to a room');
            //now get a list of all her online buddy
            manager.onlinebuddy().then(function () {
                if (typeof manager.data === 'undefined') {
                    console.error('error');
                } else {
                    if (manager.data.status == true) {
                        console.log('success fetch online buddies');
                        $scope.buddylist = manager.data.buddylist;
                    } else {
                        console.error('error', manager.data);
                    }
                }
            });
        } else {
            console.error('cannot connect to a room');
        }
    });
    socket.on('on_callrequest', function (soc, args) {
        if (typeof  args['0'] != 'undefined') {
            console.log(args['0']);
            if (args['0'].status == true) {
                var user = args['0'].user;
                var accept = confirm(user.name + " is calling you.");
                socket.emit('response_callrequest', {buddyid: user.id, status: accept});
            }

        }
    })
    socket.on('on_response_callrequest', function (soc, args) {
        if (typeof args['0'] != 'undefined') {
            var user = args['0'].user;
            console.log(user);
            if (args['0'].status == true) {
                alert(user.name + " accept your call request");
            } else {
                alert(user.name + " reject your call request");
            }
        }
    });
    $scope.callrequest = function (buddy) {
        console.log(buddy);
        if (typeof buddy !== 'undefined') {
            socket.emit('callrequest', buddy.id);
        }
    };

})