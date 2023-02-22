import SimpleCommand from "../lib/puremvc/SimpleCommand";
import IndexedDBProxy from "../proxies/IndexedDBProxy";

class ReadRecordedVideoLib extends SimpleCommand {

    execute(notification) {
        super.execute(notification);

        /**
         * @type {IndexedDBProxy}
         */
        let ip = this.facade.retrieveProxy(IndexedDBProxy.name);
        ip.readRecordedVideoLib();
    }
}

export default ReadRecordedVideoLib;