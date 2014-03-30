/**
 * Created by xerxes on 3/29/14.
 */
angular.module('webrtcApp').factory('getMediaFactory', function () {
    var getMedia = {};

    getMedia.detectBrowser = function () {
        getMedia.isMoz = !angular.isUndefined(navigator.mozGetUserMedia);
    }
    getMedia.getMedia = function (mediaConstraints, callback) {
        navigator.getUserMedia = getMedia.isMoz ? navigator.mozGetUserMedia : navigator.webkitGetUserMedia;
        try {
            navigator.getUserMedia(mediaConstraints, function (stream) {
                callback(null, stream);
            }, function (error) {
                callback(error, null);
            });
        } catch (e) {
            callback(e, null);
        }
    }
    getMedia.attachStream = function (element, stream) {
        if (typeof element.srcObject !== 'undefined') {
            element.srcObject = stream;
        } else if (typeof element.mozSrcObject !== 'undefined') {
            element.mozSrcObject = stream;
        } else if (typeof element.src !== 'undefined') {
            element.src = URL.createObjectURL(stream);
        } else {
            console.log('Error attaching stream to element.');
        }
    }
    return getMedia;
});

angular.module('webrtcApp').controller('getMediaCtrl', function ($scope, getMediaFactory) {
    getMediaFactory.detectBrowser();

    getMediaFactory.getMedia({audio: true, video: true}, function (err, stream) {
        if (err) {
            console.error('failed to get user media ', err);
        } else {
            var video = document.getElementById('localVideo');
            getMediaFactory.attachStream(video, stream);

        }
    })
});