import CameraInterface, { AllSettings, CameraEvents } from "camera-interface";
import TypedEventEmitter from "typed-emitter";
export default class Camera implements CameraInterface {
    private events_;
    get events(): TypedEventEmitter<CameraEvents>;
    private server_;
    private camera_;
    private config_file_loc_;
    private all_settings_;
    constructor(config_file_loc: string);
    SetCombinedSettings(settings: AllSettings): void;
    GetCombinedSettings(): AllSettings;
    InitServer(): void;
    InitCamera(): void;
    Stop(): void;
    private ReadConfigFile;
}
