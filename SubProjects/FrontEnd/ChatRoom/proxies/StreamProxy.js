import Proxy from "../lib/puremvc/Proxy";
import SocketIOProxy from "./SocketIOProxy";
import Constants from "../Constants";
import PreferencesProxy from "./PreferencesProxy";

class StreamProxy extends Proxy {

    constructor() {
        super(StreamProxy.name, {streamMap: new Map()});
    }

    async initLocalStream(localSocketId) {
        let localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        this.setStream(localSocketId, localStream);
    }

    /**
     * @private
     *
     * @param sid
     * @param stream
     */
    setStream(sid, stream) {
        this.data.streamMap.set(sid, stream);

        this.sendNotification(Constants.Notifications.MANAGE_STREAM_RECORDER, {
            sid: sid,
            stream: stream
        }, Constants.Notifications.MANAGE_STREAM_RECORDER_TYPE_START);
    }


    /**
     * @param sid
     * @returns {MediaStream}
     */
    getStream(sid) {
        let stream = this.data.streamMap.get(sid);
        if (!stream) {
            stream = new MediaStream();
            this.setStream(sid, stream);
        }
        return stream;
    }
}

export default StreamProxy;