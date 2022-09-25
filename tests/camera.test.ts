import { should } from "chai";
should();
import path from "path";
import { CameraClient } from "camera-connection";

import Camera from "../src/camera";

describe("Pi-Eye Camera", () => {
  it("should start sending images to connected client", (done) => {
    const start = Date.now();
    const camera = new Camera(path.join(__dirname, "..", "..", "config", "settings.json"));

    const client = new CameraClient(path.join(__dirname, "..", "..", "test-files", "config.json"));

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