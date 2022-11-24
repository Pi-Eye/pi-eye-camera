"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const camera_connection_1 = require("camera-connection");
const raspi_camera_1 = __importDefault(require("raspi-camera"));
const events_1 = require("events");
const PORT = parseInt(process.env.PORT) || 8080;
const HASH_FILE_LOC = process.env.HASH_FILE_LOC || path_1.default.join(__dirname, "..", "..", "config", "hash.json");
class Camera {
    constructor(config_file_loc) {
        this.events_ = new events_1.EventEmitter();
        this.ReadConfigFile(config_file_loc);
        this.InitServer();
        this.InitCamera();
    }
    get events() { return this.events_; }
    SetCombinedSettings(settings) {
        fs_1.default.writeFileSync(this.config_file_loc_, JSON.stringify(settings));
        this.Stop();
        this.ReadConfigFile(this.config_file_loc_);
        this.InitServer();
        this.InitCamera();
    }
    GetCombinedSettings() { return this.all_settings_; }
    InitServer() {
        this.server_ = new camera_connection_1.CameraSide(PORT, HASH_FILE_LOC, this.all_settings_);
        this.server_.events.on("error", (error) => {
            console.warn(`Error on camera websocket server, restarting camera. Error: ${error}`);
            setTimeout(() => {
                this.Stop();
                this.InitServer();
                this.InitCamera();
            });
        });
        this.server_.events.on("settings", (settings) => {
            console.log("Recieved new settings, saving and restarting camera");
            this.SetCombinedSettings(settings);
        });
    }
    InitCamera() {
        this.camera_ = new raspi_camera_1.default(this.all_settings_.camera);
        this.camera_.events.on("frame", (frame, timestamp) => {
            this.server_.QueueFrame(frame, timestamp, false);
        });
    }
    Stop() {
        this.camera_.Stop();
        this.server_.Stop();
    }
    ReadConfigFile(config_file_loc) {
        this.config_file_loc_ = config_file_loc;
        const data = fs_1.default.readFileSync(config_file_loc);
        this.all_settings_ = JSON.parse(data.toString());
    }
}
exports.default = Camera;
//# sourceMappingURL=camera.js.map