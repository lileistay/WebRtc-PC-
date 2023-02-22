import Tpl from "./MainApp.html"
import "./StreamViewer"
import Facade from "../lib/puremvc/Facade";
import Constants from "../Constants";
import DateHelper from "../helper/DateHelper";

const Vue = require("vue/dist/vue.min");

const MainApp = Vue.component("main-app", {
    template: Tpl,

    data() {
        return {
            roomName: "",
            userList: [],
            recorded_videos: [],
            userInput: "",
            roomChatOutput: "",
            recordingScreen: false
        };
    },

    mounted() {
        $('[data-toggle="tooltip"]').tooltip();
    },

    methods: {
        refreshClientList(list) {
            this.userList.length = 0;
            this.userList.push(...list);
        },

        set mediator(value) {
            this._mediator = value;
        },

        /**
         * @returns {puremvc.Mediator}
         */
        get mediator() {
            return this._mediator;
        },

        btnShowRecordLibClicked(e) {
            $(this.$refs.recorded_video_lib).modal("show");
            Facade.getInstance(Constants.Facades.MAIN).sendNotification(Constants.Notifications.READ_RECORDED_VIDEO_LIB);
        },

        refreshRecordedVideoList(videos) {
            this.recorded_videos.length = 0;
            for (let [k, v] of videos) {
                this.recorded_videos.splice(0, 0, {video_id: k, user_name: v});
            }
        },

        btnExportClicked(e) {
            let video_id = $(e.target).data("video_id");
            Facade.getInstance(Constants.Facades.MAIN).sendNotification(Constants.Notifications.EXPORT_VIDEO, {
                video_id: video_id,
                mode: Constants.Notifications.EXPORT_VIDEO_TYPE_DOWNLOAD
            });
        },

        btnPreviewClicked(e) {
            let video_id = $(e.target).data("video_id");
            Facade.getInstance(Constants.Facades.MAIN).sendNotification(Constants.Notifications.EXPORT_VIDEO, {
                video_id: video_id,
                mode: Constants.Notifications.EXPORT_VIDEO_TYPE_PREVIEW
            });
        },

        sendChatMessageInRoom() {
            if (this.userInput) {
                Facade.getInstance(Constants.Facades.MAIN).sendNotification(Constants.Notifications.SEND_CHAT_MESSAGE_IN_ROOM, this.userInput);
                this.userInput = "";
            }
        },

        userInputKeyDownHandler(e) {
            if (e.key == "Enter") {
                this.sendChatMessageInRoom();
            }
        },

        getUserRole(u) {
            if (u.mode == Constants.LOGIN_MODE.BROADCASTER) {
                return "广播者";
            } else {
                return "订阅者";
            }
        },

        btnSendClicked(e) {
            this.sendChatMessageInRoom();
        },

        appendChatInRoomMessage(userName, content) {
            this.roomChatOutput += `${userName}:\n${content}\n`;
        },

        btnStartRecordScreenClicked(e) {
            this._screenVideoId = `Screen${DateHelper.getReadableTimestamp()}`;
            Facade.getInstance(Constants.Facades.MAIN).sendNotification(Constants.Notifications.MANAGE_SCREEN_RECORDER, this._screenVideoId, Constants.Notifications.MANAGE_SCREEN_RECORDER_TYPE_START);
        },

        btnStopRecordScreenClicked(e) {
            Facade.getInstance(Constants.Facades.MAIN).sendNotification(Constants.Notifications.MANAGE_SCREEN_RECORDER, this._screenVideoId, Constants.Notifications.MANAGE_SCREEN_RECORDER_TYPE_STOP);
        }
    },

    watch: {
        roomChatOutput() {
            this.$nextTick(() => {
                this.$refs.roomChatOutputTextArea.scrollTop = this.$refs.roomChatOutputTextArea.scrollHeight;
            });
        }
    }
});

export default MainApp;