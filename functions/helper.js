import { injectMetadata } from "./ebml";
const MBPS = 1000000;
let recorder, stream;
let constraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    channelCount: 2,
    sampleRate: 48000,
    sampleSize: 16,
  },
  video: {
    width: 1920,
    height: 1080,
    frameRate: 24,
  },
};
// Start recording
export async function startRecording() {
  let [w, h] = document
    .querySelector("#resolution")
    .value.split("x")
    .map((x) => {
      return Number(x);
    });
  let bitrate = Number(document.querySelector("#bitrate").value);
  console.log(w, h, bitrate);
  constraints.video.width = w;
  constraints.video.height = h;
  try {
    stream = await navigator.mediaDevices.getDisplayMedia(constraints);
    stream.oninactive = function () {
      if (recorder.state !== "inactive") {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    recorder = new MediaRecorder(stream, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: bitrate * MBPS,
      mimeType: "video/webm;codecs=vp9,vp8",
    });
    console.log(recorder);
    const chunks = [];
    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };
    recorder.onstop = async (e) => {
      let completeBlob = new Blob(chunks, { type: "video/mp4" });
      console.log(completeBlob);
      let metaBlob = await injectMetadata(completeBlob);
      let url = URL.createObjectURL(metaBlob);
      let video = document.querySelector("#video");
      video.src = url;
      let download = document.querySelector("a");
      download.href = url;
      download.download = "file.mp4";
    };
    recorder.start();
  } catch (error) {
    return;
  }
}

// Stop function
export async function stopRecording() {
  if (recorder) {
    recorder.stop();
    stream.getTracks().forEach((track) => track.stop());
  }
}
