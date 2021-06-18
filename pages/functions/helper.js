import { injectMetadata } from "./ebml";
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
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  },
};
// Start recording
export async function startRecording() {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia(constraints);
    stream.oninactive = function () {
      if (recorder.state !== "inactive") {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    console.log(recorder);
    const chunks = [];
    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };
    recorder.onstop = async (e) => {
      let completeBlob = new Blob(chunks, { type: "video/mp4" });
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
  recorder.stop();
  stream.getTracks().forEach((track) => track.stop());
}
