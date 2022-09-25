import Camera from "./camera";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const SETTINGS_FILE_LOC = process.env.SETTINGS_FILE_LOC || path.join(__dirname, "..", "..", "config", "settings.json");

function StartCamera() {
  const camera = new Camera(SETTINGS_FILE_LOC);
}

StartCamera();