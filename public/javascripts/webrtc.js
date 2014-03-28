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
app.controller('webrtcCtrl', function ($scope, socket) {
    socket.on('on_connection',function(data,args){
        console.log(data,args);
        window.va = args;
    })
    $scope.webrtcCtrl = this;
})