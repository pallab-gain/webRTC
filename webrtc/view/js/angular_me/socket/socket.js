/**
 * Created by xerxes on 3/16/14.
 */
join_room = function (socket, options) {
    socket.emit('join_room', options);
    socket.on('on_join_room', on_join_room);
};
on_join_room = function (options) {
    console.log(options);
};
