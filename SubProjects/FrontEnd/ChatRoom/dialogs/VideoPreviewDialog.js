import DateHelper from "../helper/DateHelper";

const VideoPreviewDialog = {
    show(video_id, blob) {
        let videoBlobUrl = URL.createObjectURL(blob);
        $(`<div class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog  modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" style="word-wrap: break-word;word-break: break-all;">${video_id}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <video style="width: 100%;" controls src="${videoBlobUrl}"></video>
      </div>
    </div>
  </div>
</div>`).modal({
            keyboard: true,
            backdrop: true,
        }).appendTo(document.body).on("hide.bs.modal", function (e) {
            $(this).remove();
            URL.revokeObjectURL(videoBlobUrl);
        });
    }
};

export default VideoPreviewDialog;