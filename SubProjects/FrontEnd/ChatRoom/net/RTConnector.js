import SocketIOProxy from "../proxies/SocketIOProxy";

class RTConnector {
    /**
     * @param proxy {RTConnectorProxy}
     * @param targetSid
     */
    constructor(proxy, targetSid) {
        this._proxy = proxy;
        this._targetSid = targetSid;

        /**
         * @type {SocketIOProxy}
         * @private
         */
        this._socketIoProxy = this._proxy.facade.retrieveProxy(SocketIOProxy.name);
    }

    get proxy() {
        return this._proxy;
    }

    get targetSid() {
        return this._targetSid;
    }

    get socketProxy() {
        return this._socketIoProxy;
    }

    handleIce(message) {

    }
}

export default RTConnector;