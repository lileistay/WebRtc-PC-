import RTConnector from "./RTConnector";
import Constants from "../Constants";
import MessageType from "../vo/MessageType";
import StreamHelper from "../helper/StreamHelper";
import StreamProxy from "../proxies/StreamProxy";
import SocketIOProxy from "../proxies/SocketIOProxy";

class AnswerRTConnector extends RTConnector {


    constructor(proxy, targetSid) {
        super(proxy, targetSid);
    }

    async startAnswer(message) {
        /**
         *
         * @type {StreamProxy}
         */
        let streamProxy = this.proxy.facade.retrieveProxy(StreamProxy.name);

        this._answerPc = new RTCPeerConnection(Constants.RTC_CONFIGURATION);
        this._answerPc.ontrack = e => {
            streamProxy.getStream(this.targetSid).addTrack(e.track);
        };
        this._answerPc.onicecandidate = e => {
            if (e.candidate) {
                this.socketProxy.sendMessage(this.targetSid, MessageType.SEND_ANSWER_ICE_CANDIDATE, e.candidate);
            }
        };
        this._answerPc.onsignalingstatechange = this.signalingstatechangeHandler.bind(this);

        await this._answerPc.setRemoteDescription(new RTCSessionDescription(message.data));

        let localStream = StreamHelper.getLocalStream(this.proxy.facade);
        let tracks = [];
        if (this.proxy.facade.retrieveProxy(SocketIOProxy.name).getData().mode == Constants.LOGIN_MODE.BROADCASTER) {
            tracks = localStream.getTracks();
        } else {
            tracks = localStream.getVideoTracks();
        }
        tracks.forEach(t => {
            this._answerPc.addTrack(t);
        });

        let answer = await this._answerPc.createAnswer();
        await this._answerPc.setLocalDescription(new RTCSessionDescription(answer));

        this._socketIoProxy.sendMessage(this._targetSid, MessageType.SEND_ANSWER_SESSION_DESCRIPTION, answer);
    }

    signalingstatechangeHandler(e) {
        console.log(this._answerPc.signalingState);
    }


    handleIce(message) {
        super.handleIce(message);
        console.log("Add ice");
        this._answerPc.addIceCandidate(new RTCIceCandidate(message.data));
    }
}


export default AnswerRTConnector;