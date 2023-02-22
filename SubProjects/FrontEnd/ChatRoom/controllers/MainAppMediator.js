import Mediator from "../lib/puremvc/Mediator";
import MainApp from "./MainApp";
import Constants from "../Constants";

class MainAppMediator extends Mediator {


    constructor() {
        const rootContainer = document.createElement("div");
        document.body.appendChild(rootContainer);

        let mainApp = new MainApp();
        mainApp.$mount(rootContainer);
        super(MainAppMediator.name, mainApp);
        mainApp.mediator = this;
        this._currentClientList = [];
    }

    listNotificationInterests() {
        return [
            Constants.Notifications.REFRESH_ROOM_NAME,
            Constants.Notifications.REFRESH_CLIENT_LIST,
            Constants.Notifications.RECORDED_VIDEOS_LOADED,
            Constants.Notifications.RECEIVED_CHAT_MESSAGE_IN_ROOM,
            Constants.Notifications.STOPPED_TO_RECORD_SCREEN,
            Constants.Notifications.STARTED_TO_RECORD_SCREEN
        ];
    }

    handleNotification(notification) {
        switch (notification.name) {
            case Constants.Notifications.REFRESH_CLIENT_LIST:
                this._currentClientList = notification.body;
                this.viewComponent.refreshClientList(notification.body);
                break;
            case Constants.Notifications.REFRESH_ROOM_NAME:
                this.viewComponent.roomName = notification.body;
                break;
            case Constants.Notifications.RECORDED_VIDEOS_LOADED:
                this.viewComponent.refreshRecordedVideoList(notification.body);
                break;
            case Constants.Notifications.RECEIVED_CHAT_MESSAGE_IN_ROOM:
                this.viewComponent.appendChatInRoomMessage(notification.body.userName, notification.body.content);
                break;
            case Constants.Notifications.STARTED_TO_RECORD_SCREEN:
                this.viewComponent.recordingScreen = true;
                break;
            case Constants.Notifications.STOPPED_TO_RECORD_SCREEN:
                this.viewComponent.recordingScreen = false;
                break;
        }
    }

    getUserNameBySid(sid) {
        for (let u of this._currentClientList) {
            if (u.sid == sid) {
                return u.userName;
            }
        }
        return "";
    }
}

export default MainAppMediator;