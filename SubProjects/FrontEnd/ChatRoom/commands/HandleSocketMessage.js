import SimpleCommand from "../lib/puremvc/SimpleCommand";
import RTConnectorProxy from "../proxies/RTConnectorProxy";
import MessageType from "../vo/MessageType";

class HandleSocketMessage extends SimpleCommand {

    execute(notification) {
        super.execute(notification);

        let message = notification.body;
        console.log(message);

        /**
         * @type {RTConnectorProxy}
         */
        let connProxy = this.facade.retrieveProxy(RTConnectorProxy.name);

        if (message.command) {
            switch (message.command) {
                case MessageType.SEND_OFFER_SESSION_DESCRIPTION:
                    connProxy.startAnswer(message);
                    break;
                case MessageType.SEND_ANSWER_SESSION_DESCRIPTION:
                    connProxy.handleReceivedAnswer(message);
                    break;
                case MessageType.SEND_OFFER_ICE_CANDIDATE:
                    connProxy.handleOfferIce(message);
                    break;
                case MessageType.SEND_ANSWER_ICE_CANDIDATE:
                    connProxy.handleAnswerIce(message);
                    break;
            }
        }
    }

}

export default HandleSocketMessage;