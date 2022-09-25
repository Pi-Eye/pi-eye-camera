import fs from "fs";
import path from "path";
import { CameraSide } from "camera-connection";
import CameraInterface, { AllSettings, CameraEvents } from "camera-interface";
import RaspiCamera from "raspi-camera";
import { EventEmitter } from "events";
import TypedEventEmitter from "typed-emitter";

const PORT = parseInt(process.env.PORT) || 8080;
const HASH_FILE_LOC = process.env.HASH_FILE_LOC || path.join(__dirname, "..", "..", "config", "hash.json");
export default class Camera implements CameraInterface {
  private events_ = new EventEmitter() as TypedEventEmitter<CameraEvents>;
  get events() { return this.events_; }

  private server_: CameraSide;
  private camera_: RaspiCamera;

  private config_file_loc_: string;
  private all_settings_: AllSettings;

  constructor(config_file_loc: string) {
    this.ReadConfigFile(config_file_loc);
    this.InitServer();
    this.InitCamera();
  }

  SetCombinedSettings(settings: AllSettings) {
    fs.writeFileSync(this.config_file_loc_, JSON.stringify(settings));
    this.Stop();
    this.ReadConfigFile(this.config_file_loc_);
    this.InitServer();
    this.InitCamera();
  }

  GetCombinedSettings(): AllSettings { return this.all_settings_; }

  InitServer() {
    this.server_ = new CameraSide(PORT, HASH_FILE_LOC, this.all_settings_);

    this.server_.events.on("error", (error) => {
      console.warn(`Error on camera websocket server, restarting camera. Error: ${error}`);
      setTimeout(() => {
        this.Stop();
        this.InitServer();
        this.InitCamera();
      });
    });
  }

  InitCamera() {
    this.camera_ = new RaspiCamera(this.all_settings_.camera);

    this.camera_.events.on("frame", (frame, timestamp) => {
      this.server_.QueueFrame(frame, timestamp, false);
    });
  }

  Stop() {
    this.camera_.Stop();
    this.server_.Stop();
  }

  private ReadConfigFile(config_file_loc: string) {
    this.config_file_loc_ = config_file_loc;
    const data = fs.readFileSync(config_file_loc);
    this.all_settings_ = JSON.parse(data.toString());
  }
}