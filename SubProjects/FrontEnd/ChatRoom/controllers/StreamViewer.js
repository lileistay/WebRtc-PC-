import Vue from "vue/dist/vue.min"
import Tpl from "./StreamViewer.html"
import StreamProxy from "../proxies/StreamProxy";
import SocketHelper from "../helper/SocketHelper";

const StreamViewer = Vue.component("stream-viewer", {
    template: Tpl,
    props: ["sid", "mediator"],
    mounted() {
        this.refreshViewer();
    },

    methods: {
        async refreshViewer() {
            this.$refs.video_el.srcObject = await this.mediator.facade.retrieveProxy(StreamProxy.name).getStream(this.sid);

            if (SocketHelper.getSocket(this.mediator.facade).id == this.sid) {
                this.$refs.video_el.muted = true;//本机静音
            } else {
                this.$refs.video_el.muted = false;
            }
        }
    },

    watch: {
        sid(newVal) {
            this.refreshViewer();
        }
    }
});

export default StreamViewer;