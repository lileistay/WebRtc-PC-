import StreamProxy from "../proxies/StreamProxy";
import SocketHelper from "./SocketHelper";

const StreamHelper = {
    /**
     * @param facade {puremvc.Facade}
     * @returns {*}
     */
    getLocalStream(facade) {
        return facade.retrieveProxy(StreamProxy.name).getStream(SocketHelper.getSocket(facade).id);
    },
};

export default StreamHelper;