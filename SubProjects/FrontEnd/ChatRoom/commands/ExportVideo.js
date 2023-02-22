import SimpleCommand from "../lib/puremvc/SimpleCommand";
import IndexedDBProxy from "../proxies/IndexedDBProxy";

class ExportVideo extends SimpleCommand {
    execute(notification) {
        super.execute(notification);


        /**
         * @type {IndexedDBProxy}
         */
        let ip = this.facade.retrieveProxy(IndexedDBProxy.name);
        ip.exportVideo(notification.body.video_id, notification.body.mode);
    }
}

export default ExportVideo;