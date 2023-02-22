import OfferRTConnector from "../net/OfferRTConnector";
import SocketHelper from "../helper/SocketHelper";
import AnswerRTConnector from "../net/AnswerRTConnector";
import Proxy from "../lib/puremvc/Proxy";

class RTConnectorProxy extends Proxy {

    constructor() {
        super(RTConnectorProxy.name, {connectors: new Map()});
    }

    startOffer(sid) {
        let currentSocket = SocketHelper.getSocket(this.facade);
        if (currentSocket.id != sid) {
            let conn = new OfferRTConnector(this, sid);
            conn.startOffer();
            this.data.connectors.set(sid, conn);
        }
    }

    /**
     * @param message {Message}
     */
    startAnswer(message) {
        let conn = new AnswerRTConnector(this, message.from);
        conn.startAnswer(message);
        this.data.connectors.set(message.from, conn);
    }

    /**
     * @param message {Message}
     */
    handleReceivedAnswer(message) {
        this.getConnector(message.from).handleReceivedAnswer(message);
    }


    handleOfferIce(message) {
        this.getConnector(message.from).handleIce(message);
    }

    handleAnswerIce(message) {
        this.getConnector(message.from).handleIce(message);
    }

    /**
     * @param targetSid
     * @returns {OfferRTConnector}
     */
    getConnector(targetSid) {
        return this.data.connectors.get(targetSid);
    }
}

export default RTConnectorProxy;