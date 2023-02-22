import SimpleCommand from "../lib/puremvc/SimpleCommand";
import SocketIOProxy from "../proxies/SocketIOProxy";

class Login extends SimpleCommand {


    execute(notification) {
        super.execute(notification);

        /**
         * @type {SocketIOProxy}
         */
        let p = this.facade.retrieveProxy(SocketIOProxy.name);
        // p.login(notification.body.roomName, notification.body.userName, notification.body.mode, true);

        p.connectServer(notification.body.roomName, notification.body.userName, notification.body.mode);
    }
}

export default Login;