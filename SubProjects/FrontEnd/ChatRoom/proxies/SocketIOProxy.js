import Constants from "../Constants";
import Dialog from "../dialogs/Dialog";
import RTConnectorProxy from "./RTConnectorProxy";
import Message from "../vo/Message";
import StreamProxy from "./StreamProxy";
import Proxy from "../lib/puremvc/Proxy";

const SocketEvents = require("../../../Commons/SocketEvents");

export default class SocketIOProxy extends Proxy {


    constructor() {
        super(SocketIOProxy.name, {
            socket: null,
            currentRoomName: null,
            userName: null,
            mode: Constants.LOGIN_MODE.SUBSCRIBER
        });
    }


    connectServer(roomName, userName, mode) {
        this.data.roomName = roomName;
        this.data.userName = userName;
        this.data.mode = mode;
        this.data.socket = io();

        this.addSocketListeners();
    }


    addSocketListeners() {
        this.data.socket.on("connect", this.socketConnectedHandler.bind(this));
        this.data.socket.on(SocketEvents.LIST_CLIENTS, this.listClientsHandler.bind(this));
        this.data.socket.on(SocketEvents.SEND_MESSAGE, this.messageHandler.bind(this));
        this.data.socket.on(SocketEvents.CHAT_MESSAGE_IN_ROOM, this.chatMessageInRoomHandler.bind(this));
    }

    async socketConnectedHandler() {
        await this.facade.retrieveProxy(StreamProxy.name).initLocalStream(this.data.socket.id);

        this.login(true);
    }


    listClientsHandler(message) {
        this.sendNotification(Constants.Notifications.REFRESH_CLIENT_LIST, message);
    }

    login(showLoadingDialog = false) {
        this.sendNotification(Constants.Notifications.REFRESH_ROOM_NAME, this.data.roomName);

        let self = this;

        let pd = showLoadingDialog ? Dialog.showLoading(`正在进入会议室 ${this.data.roomName}`) : undefined;
        this.data.socket.emit(SocketEvents.JOIN_IN_ROOM, {
            roomName: this.data.roomName,
            userName: this.data.userName,
            mode: this.data.mode
        }, function (userList) {
            if (pd) pd.modal("hide");

            /**
             * @type {RTConnectorProxy}
             */
            let p = self.facade.retrieveProxy(RTConnectorProxy.name);
            for (let u of userList) {
                p.startOffer(u.sid);
            }
        });
    }

    sendMessage(to, type, data) {
        console.log(`Send message[${type}] to ${to}`);

        let msg = Message.makeMessage(this.data.socket.id, to, type, data);
        this.data.socket.emit(SocketEvents.SEND_MESSAGE, msg);
    }

    messageHandler(message) {
        this.sendNotification(Constants.Notifications.COMMAND_HANDLE_SOCKET_MESSAGE, message);
    }

    sendChatMessageInRoom(message) {
        this.data.socket.emit(SocketEvents.CHAT_MESSAGE_IN_ROOM, message);
    }

    chatMessageInRoomHandler(message) {
        this.sendNotification(Constants.Notifications.RECEIVED_CHAT_MESSAGE_IN_ROOM, message);
    }
}