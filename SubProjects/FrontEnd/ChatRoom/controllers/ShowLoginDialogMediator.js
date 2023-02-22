import Mediator from "../lib/puremvc/Mediator";
import Constants from "../Constants";

class ShowLoginDialogMediator extends Mediator {


    constructor() {
        super(ShowLoginDialogMediator.name);
    }


    listNotificationInterests() {
        return [Constants.Notifications.SHOW_LOGIN_DIALOG];
    }

    handleNotification(notification) {
        switch (notification.name) {
            case Constants.Notifications.SHOW_LOGIN_DIALOG:
                this.showDialog();
                break;
        }
    }

    showDialog() {
        let self = this;

        let modeSelectRow = `<tr>
              <td>模式</td>
              <td>
                <div class="btn-group btn-group-toggle" data-toggle="buttons">
                  <label class="btn btn-outline-primary active" data-toggle="tooltip" title="订阅模式默认静音" data-placement="left">
                    <input type="radio" name="mode" value="subscriber" checked> 订阅模式
                  </label>
                  <label class="btn btn-outline-primary" data-toggle="tooltip" title="广播模式默认带声音" data-placement="right">
                    <input type="radio" name="mode" value="broadcaster"> 广播模式
                  </label>
                </div>
               </td>
            </tr>`;
        if (window.chatClientMode) {
            modeSelectRow = "";
        }

        let d = $(`<div class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title"></h5>
      </div>
      <div class="modal-body">
        <table class="table table-borderless">
          <tbody>
            <tr>
              <td>会议室</td>
              <td>
                <input class="form-control room-name-input">
              </td>
            </tr>
            <tr>
              <td>呢称</td>
              <td>
                <input class="form-control user-name-input">
              </td>
            </tr>
            ${modeSelectRow}
          </tbody>
        </table>
        <div class="status-div"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary btn-ok">进入</button>
      </div>
    </div>
  </div>
</div>`).modal({
            keyboard: false,
            backdrop: "static",
        }).appendTo(document.body).on("hide.bs.modal", function (e) {
            $(this).remove();
        });

        d.find("[data-toggle='tooltip']").tooltip();
        let btnOk = d.find(".btn-ok");
        let roomNameInput = d.find(".room-name-input");
        let statusDiv = d.find(".status-div");
        let userNameInput = d.find(".user-name-input");

        function addListeners() {
            btnOk.click(function () {
                let roomName = roomNameInput.val();
                if (!roomName) {
                    statusDiv.html("<span class='text-danger'>请输入会议室名称</span>");
                    return;
                }

                let userName = userNameInput.val();

                if (!userName) {
                    statusDiv.html("<span class='text-danger'>请输入您的呢称</span>");
                    return;
                }

                statusDiv.empty();

                let mode = window.chatClientMode || d.find(".active input[name='mode']").val();

                d.modal("hide");

                self.sendNotification(Constants.Notifications.COMMAND_LOGIN, {
                    userName: userName,
                    roomName: roomName,
                    mode: mode
                });
            });
        }

        function main() {
            addListeners();
        }

        main();
    }
}


export default ShowLoginDialogMediator;