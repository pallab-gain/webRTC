/**
 * Created by xerxes on 3/14/14.
 */

var user = function (options) {
    var name = options.name || null;
    var uid = options.uid;
    return {
        name: name,
        uid: uid
    }
};
