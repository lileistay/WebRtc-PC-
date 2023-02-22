import Proxy from "../lib/puremvc/Proxy";

class PreferencesProxy extends Proxy {


    constructor() {
        super(PreferencesProxy.name, {});
    }

    /**
     * 是否录制聊天视频
     * @returns {string}
     */
    get recordStreams() {
        return localStorage.getItem("recordStreams");
    }

    set recordStreams(value) {
        localStorage.setItem("recordStreams", value ? "yes" : "");
    }
}

export default PreferencesProxy;