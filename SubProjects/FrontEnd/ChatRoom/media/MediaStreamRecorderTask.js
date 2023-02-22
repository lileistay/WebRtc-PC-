import Constants from "../Constants";
import Facade from "../lib/puremvc/Facade";
import SocketIOProxy from "../proxies/SocketIOProxy";

class MediaStreamRecorderTask {

    constructor(video_id, stream, userName) {
        this._sid = video_id;
        /**
         * @type {MediaStream}
         */
        this._stream = stream;
        this._recording = false;
        this._userName = userName;

        /**
         * @type {SocketIOProxy}
         */
        this._socketProxy = Facade.getInstance(Constants.Facades.MAIN).retrieveProxy(SocketIOProxy.name);
        this._video_id = video_id;
    }


    startRecordProcess() {
        this._recorder = new MediaRecorder(this._stream, {mimeType: Constants.MediaRecorder.MIME_TYPE});
        this._recorder.ondataavailable = e => {
            Facade.getInstance(Constants.Facades.MAIN).sendNotification(Constants.Notifications.STORE_RECORDED_DATA, {
                video_id: this._video_id,
                userName: this._userName,
                data: e.data
            });
        };
        this._recorder.start(Constants.MediaRecorder.TIME_SPLIT);
    }

    start() {
        if (!MediaRecorder.isTypeSupported(Constants.MediaRecorder.MIME_TYPE)) {
            console.error("Your browser dose not support record video");
            return;
        }

        if (!this._recording) {
            if (this._stream.active) {
                this.startRecordProcess();
            } else {
                this._stream.onactive = () => {
                    this.startRecordProcess();
                };
            }
            this._recording = true;
        }
    }

    stop() {
        if (this._recording && this._recorder) {
            this._recorder.stop();
            this._recording = false;
        }
    }
}

/**
 * @type {Map<String, MediaStreamRecorderTask>}
 */
MediaStreamRecorderTask.__recoderMap = new Map();

MediaStreamRecorderTask.startRecord = function (video_id, stream, userName) {
    let task = MediaStreamRecorderTask.__recoderMap.get(video_id);
    if (!task) {
        task = new MediaStreamRecorderTask(video_id, stream, userName);
        MediaStreamRecorderTask.__recoderMap.set(video_id, task);
        task.start();
    }
};
MediaStreamRecorderTask.stopRecord = function (video_id, stream = null) {
    let task = MediaStreamRecorderTask.__recoderMap.get(video_id);
    if (task) {
        task.stop();
        MediaStreamRecorderTask.__recoderMap.delete(video_id);
    }
};


export default MediaStreamRecorderTask;