import SimpleCommand from "../lib/puremvc/SimpleCommand";
import SocketIOProxy from "../proxies/SocketIOProxy";

class SendChatMessageInRoom extends SimpleCommand {

    execute(notification) {
        super.execute(notification);

        /**
         *
         * @type {SocketIOProxy}
         */
        let sp = this.facade.retrieveProxy(SocketIOProxy.name);
        sp.sendChatMessageInRoom(notification.body);
    }
}

export default SendChatMessageInRoom;