const SocketEvents = require("../SubProjects/Commons/SocketEvents");

const SocketIO = require("socket.io");

function configWithExpress(server) {
    const io = SocketIO(server);

    io.on('connection', socket => {

        function getClientsInRooms(roomName) {
            return new Promise(resolve => {
                io.to(roomName).clients((err, clients) => {
                    let usersInRoom = [];
                    for (let sid of clients) {
                        let s = io.to(sid).sockets[sid];
                        usersInRoom.push({sid: sid, userName: s.userName, roomName: s.roomName, mode: s.mode});
                    }
                    resolve(usersInRoom);
                });
            });
        }

        async function broadcastClientsInCurrentRoom() {
            let usersInRoom = await getClientsInRooms(socket.roomName);
            io.to(socket.roomName).emit(SocketEvents.LIST_CLIENTS, usersInRoom);
        }

        function sendMessageHandler(message) {
            if (message.from && message.to) {
                io.of("/").to(message.to).emit(SocketEvents.SEND_MESSAGE, message);
                console.log(`Send message[${message.command}] from ${message.from} to ${message.to}`);
            } else {
                console.warn("Can not send this message without from&to socket id.");
            }
        }

        function disconnectedHandler(reason) {
            broadcastClientsInCurrentRoom();
        }

        function joinInRoomHandler(message, callback) {
            socket.roomName = message.roomName;
            socket.userName = message.userName;
            socket.mode = message.mode;

            socket.join(message.roomName, async () => {
                broadcastClientsInCurrentRoom();
                callback(await getClientsInRooms(message.roomName));
            });

        }

        function chatMessageInRoomHandler(message) {
            io.to(socket.roomName).emit(SocketEvents.CHAT_MESSAGE_IN_ROOM, {
                userName: socket.userName,
                content: message
            });
        }

        function addListeners() {
            socket.on(SocketEvents.SEND_MESSAGE, sendMessageHandler);
            socket.on("disconnect", disconnectedHandler);
            socket.on(SocketEvents.JOIN_IN_ROOM, joinInRoomHandler);
            socket.on(SocketEvents.CHAT_MESSAGE_IN_ROOM, chatMessageInRoomHandler);
        }


        function main() {
            addListeners();
        }

        main();
    })
}

module.exports = {configWithExpress: configWithExpress};