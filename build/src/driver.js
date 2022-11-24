"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camera_1 = __importDefault(require("./camera"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "..", ".env") });
const SETTINGS_FILE_LOC = process.env.SETTINGS_FILE_LOC || path_1.default.join(__dirname, "..", "..", "config", "settings.json");
function StartCamera() {
    const camera = new camera_1.default(SETTINGS_FILE_LOC);
}
StartCamera();
//# sourceMappingURL=driver.js.map