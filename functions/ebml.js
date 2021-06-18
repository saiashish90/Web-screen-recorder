import { Decoder, tools, Reader } from "ts-ebml";
const readAsArrayBuffer = function (blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = (ev) => {
      reject(ev.error);
    };
  });
};

export const injectMetadata = function (blob) {
  const decoder = new Decoder();
  const reader = new Reader();
  reader.logging = false;
  reader.drop_default_duration = false;

  return readAsArrayBuffer(blob).then((buffer) => {
    const elms = decoder.decode(buffer);
    elms.forEach((elm) => {
      reader.read(elm);
    });
    reader.stop();

    var refinedMetadataBuf = tools.makeMetadataSeekable(
      reader.metadatas,
      reader.duration,
      reader.cues
    );
    var body = buffer.slice(reader.metadataSize);

    const result = new Blob([refinedMetadataBuf, body], { type: blob.type });
    return result;
  });
};
