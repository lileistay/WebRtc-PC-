import SimpleCommand from "../lib/puremvc/SimpleCommand";
import SocketIOProxy from "../proxies/SocketIOProxy";
import Constants from "../Constants";

class StartUp extends SimpleCommand {
    execute(notification) {
        super.execute(notification);


        /**
         * @type {SocketIOProxy}
         */
        // let sp = this.facade.retrieveProxy(SocketIOProxy.name);
        // sp.connectServer();

        this.sendNotification(Constants.Notifications.SHOW_LOGIN_DIALOG);
    }
}


export default StartUp;