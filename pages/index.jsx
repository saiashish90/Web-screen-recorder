import styles from "../styles/Home.module.css";
import { useRef } from "react";
import { startRecording, stopRecording } from "./functions/helper";
// JSX
export default function Home() {
  let start = useRef();
  let stop = useRef();
  return (
    <>
      <button onClick={startRecording} ref={start}>
        Start recording
      </button>
      <select id="resolution">
        <option value="1920x1080">1080p</option>
        <option value="1280x720">720p</option>
      </select>
      <select id="bitrate">
        <option value="2.5">2.5 MBPS</option>
        <option value="5">5 MBPS</option>
        <option value="10">10 MBPS</option>
      </select>
      <button onClick={stopRecording} ref={stop}>
        Stop recording
      </button>
      <iframe id="video" src="" frameBorder="0" />
      <a href="">Download</a>
    </>
  );
}
