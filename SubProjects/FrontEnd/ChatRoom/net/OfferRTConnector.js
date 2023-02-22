import Constants from "../Constants";
import MessageType from "../vo/MessageType";
import RTConnector from "./RTConnector";
import StreamHelper from "../helper/StreamHelper";
import StreamProxy from "../proxies/StreamProxy";
import SocketHelper from "../helper/SocketHelper";
import SocketIOProxy from "../proxies/SocketIOProxy";

class OfferRTConnector extends RTConnector {

    /**
     * @param proxy {RTConnectorProxy}
     * @param targetSid
     */
    constructor(proxy, targetSid) {
        super(proxy, targetSid);
    }

    async startOffer() {
        /**
         *
         * @type {StreamProxy}
         */
        let streamProxy = this.proxy.facade.retrieveProxy(StreamProxy.name);

        this._offerPc = new RTCPeerConnection(Constants.RTC_CONFIGURATION);
        this._offerPc.onicecandidate = e => {
            if (e.candidate) {
                this.socketProxy.sendMessage(this.targetSid, MessageType.SEND_OFFER_ICE_CANDIDATE, e.candidate);
            }
        };

        this._offerPc.ontrack = e => {
            streamProxy.getStream(this.targetSid).addTrack(e.track);
        };

        this._offerPc.onsignalingstatechange = this.signalingstatechangeHandler.bind(this);

        this._offerPc.onnegotiationneeded = async e => {
            let offer = await this._offerPc.createOffer();
            await this._offerPc.setLocalDescription(new RTCSessionDescription(offer));
            this._socketIoProxy.sendMessage(this._targetSid, MessageType.SEND_OFFER_SESSION_DESCRIPTION, offer);
        };

        let localStream = StreamHelper.getLocalStream(this.proxy.facade);
        let tracks = [];
        if (this.proxy.facade.retrieveProxy(SocketIOProxy.name).getData().mode == Constants.LOGIN_MODE.BROADCASTER) {
            tracks = localStream.getTracks();
        } else {
            tracks = localStream.getVideoTracks();
        }
        tracks.forEach(t => {
            this._offerPc.addTrack(t);
        });
    }


    async handleReceivedAnswer(message) {
        await this._offerPc.setRemoteDescription(new RTCSessionDescription(message.data));
        console.log("Received answer");
    }

    signalingstatechangeHandler(e) {
        console.log(this._offerPc.signalingState);
    }


    handleIce(message) {
        super.handleIce(message);
        console.log("Add ice");
        this._offerPc.addIceCandidate(new RTCIceCandidate(message.data));
    }
}

export default OfferRTConnector;