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
      <button onClick={stopRecording} ref={stop}>
        Stop recording
      </button>
      <iframe id="video" src="" frameBorder="0" />
      <a href="">Download</a>
    </>
  );
}
