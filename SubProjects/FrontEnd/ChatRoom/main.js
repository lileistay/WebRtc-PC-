import Constants from "./Constants"
import SocketIOProxy from "./proxies/SocketIOProxy";
import "./style.css"
import StreamProxy from "./proxies/StreamProxy";
import RTConnectorProxy from "./proxies/RTConnectorProxy";
import Facade from "./lib/puremvc/Facade";
import MainAppMediator from "./controllers/MainAppMediator";
import ShowLoginDialogMediator from "./controllers/ShowLoginDialogMediator";
import Login from "./commands/Login";
import HandleSocketMessage from "./commands/HandleSocketMessage";
import RefreshClientList from "./commands/RefreshClientList";
import ManageStreamRecorder from "./commands/ManageStreamRecorder";
import StoreRecordedData from "./commands/StoreRecordedData";
import IndexedDBProxy from "./proxies/IndexedDBProxy";
import ReadRecordedVideoLib from "./commands/ReadRecordedVideoLib";
import ExportVideo from "./commands/ExportVideo";
import SendChatMessageInRoom from "./commands/SendChatMessageInRoom";
import PreferencesProxy from "./proxies/PreferencesProxy";
import StartUp from "./commands/StartUp";
import ManageScreenRecorder from "./commands/ManageScreenRecorder";


let main = Facade.getInstance(Constants.Facades.MAIN);

main.registerCommand(Constants.Notifications.COMMAND_LOGIN, Login);
main.registerCommand(Constants.Notifications.COMMAND_HANDLE_SOCKET_MESSAGE, HandleSocketMessage);
main.registerCommand(Constants.Notifications.REFRESH_CLIENT_LIST, RefreshClientList);
main.registerCommand(Constants.Notifications.MANAGE_STREAM_RECORDER, ManageStreamRecorder);
main.registerCommand(Constants.Notifications.STORE_RECORDED_DATA, StoreRecordedData);
main.registerCommand(Constants.Notifications.READ_RECORDED_VIDEO_LIB, ReadRecordedVideoLib);
main.registerCommand(Constants.Notifications.EXPORT_VIDEO, ExportVideo);
main.registerCommand(Constants.Notifications.SEND_CHAT_MESSAGE_IN_ROOM, SendChatMessageInRoom);
main.registerCommand(Constants.Notifications.START_UP, StartUp);
main.registerCommand(Constants.Notifications.MANAGE_SCREEN_RECORDER, ManageScreenRecorder);

main.registerMediator(new MainAppMediator());
main.registerMediator(new ShowLoginDialogMediator());

main.registerProxy(new SocketIOProxy());
main.registerProxy(new StreamProxy());
main.registerProxy(new RTConnectorProxy());
main.registerProxy(new IndexedDBProxy());
main.registerProxy(new PreferencesProxy());

main.sendNotification(Constants.Notifications.START_UP);