"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
(0, chai_1.should)();
const path_1 = __importDefault(require("path"));
const camera_connection_1 = require("camera-connection");
const camera_1 = __importDefault(require("../src/camera"));
describe("Pi-Eye Camera", () => {
    it("should start sending images to connected client", (done) => {
        const start = Date.now();
        const camera = new camera_1.default(path_1.default.join(__dirname, "..", "..", "config", "settings.json"));
        const client = new camera_connection_1.CameraClient(path_1.default.join(__dirname, "..", "..", "test-files", "config.json"));
        client.events.once("frame", (frame, timestamp, motion) => {
            (start < timestamp).should.be.true;
            (timestamp < Date.now()).should.be.true;
            motion.should.be.false;
            camera.Stop();
            client.Stop();
            done();
        });
    });
});
//# sourceMappingURL=camera.test.js.map