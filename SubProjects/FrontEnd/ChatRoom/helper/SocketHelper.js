import SocketIOProxy from "../proxies/SocketIOProxy";

const SocketHelper = {
    getSocket(facade) {
        return facade.retrieveProxy(SocketIOProxy.name).getData().socket;
    }
};

export default SocketHelper;