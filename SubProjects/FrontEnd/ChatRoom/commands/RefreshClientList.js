import SimpleCommand from "../lib/puremvc/SimpleCommand";
import StreamProxy from "../proxies/StreamProxy";
import Constants from "../Constants";

class RefreshClientList extends SimpleCommand {


    execute(notification) {
        super.execute(notification);

        let lostConnectionStreams = this.getLostConnectionStreams(notification);
        for (let [key, value] of lostConnectionStreams) {
            this.sendNotification(Constants.Notifications.MANAGE_STREAM_RECORDER, {
                sid: key,
                stream: value
            }, Constants.Notifications.MANAGE_STREAM_RECORDER_TYPE_STOP);
        }
    }


    /**
     * 获取已经失去连接的Stream
     * @returns {Map<String, MediaStream>}
     */
    getLostConnectionStreams(notification) {
        /**
         * @type {StreamProxy}
         */
        let sp = this.facade.retrieveProxy(StreamProxy.name);
        let allStream = sp.data.streamMap;
        let newMap = new Map();
        for (let [key, value] of allStream) {
            newMap.set(key, value);
        }
        for (let u of notification.body) {
            newMap.delete(u.sid);
        }
        return newMap;
    }
}

export default RefreshClientList;