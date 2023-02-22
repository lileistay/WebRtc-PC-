import SimpleCommand from "../lib/puremvc/SimpleCommand";
import Constants from "../Constants";
import Dialog from "../dialogs/Dialog";
import MediaStreamRecorderTask from "../media/MediaStreamRecorderTask";

class ManageScreenRecorder extends SimpleCommand {


    constructor() {
        super();
    }

    async execute(notification) {
        super.execute(notification);

        switch (notification.type) {
            case Constants.Notifications.MANAGE_SCREEN_RECORDER_TYPE_STOP:
                MediaStreamRecorderTask.stopRecord(notification.body);
                this.sendNotification(Constants.Notifications.STOPPED_TO_RECORD_SCREEN);
                break;
            case Constants.Notifications.MANAGE_SCREEN_RECORDER_TYPE_START:
                try {
                    this._scrrenStream = await navigator.mediaDevices.getDisplayMedia();
                    MediaStreamRecorderTask.startRecord(notification.body, this._scrrenStream, "");
                    this.sendNotification(Constants.Notifications.STARTED_TO_RECORD_SCREEN);
                } catch (e) {
                    Dialog.showMessageDialog("您取消了屏幕录制");
                }
                break;
        }
    }
}

export default ManageScreenRecorder;