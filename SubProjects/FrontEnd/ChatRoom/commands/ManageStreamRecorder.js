import SimpleCommand from "../lib/puremvc/SimpleCommand";
import Constants from "../Constants";
import MediaStreamRecorderTask from "../media/MediaStreamRecorderTask"
import MainAppMediator from "../controllers/MainAppMediator";
import PreferencesProxy from "../proxies/PreferencesProxy";
import SocketIOProxy from "../proxies/SocketIOProxy";

class ManageStreamRecorder extends SimpleCommand {
    execute(notification) {
        super.execute(notification);

        /**
         *
         * @type {PreferencesProxy}
         */
        let pp = this.facade.retrieveProxy(PreferencesProxy.name);
        if (pp.recordStreams) {
            /**
             *
             * @type {SocketIOProxy}
             */
            let sp = this.facade.retrieveProxy(SocketIOProxy.name);
            let video_id = `${sp.data.socket.id}______${notification.body.sid}`;
            switch (notification.type) {
                case Constants.Notifications.MANAGE_STREAM_RECORDER_TYPE_START:
                    /**
                     * @type {MainAppMediator}
                     */
                    let m = this.facade.retrieveMediator(MainAppMediator.name);
                    MediaStreamRecorderTask.startRecord(video_id, notification.body.stream, m.getUserNameBySid(notification.body.sid));
                    break;
                case Constants.Notifications.MANAGE_STREAM_RECORDER_TYPE_STOP:
                    MediaStreamRecorderTask.stopRecord(video_id, notification.body.stream);
                    break;
            }
        }
    }
}

export default ManageStreamRecorder;