// public/workers/json-parser.worker.js

self.onmessage = function (e) {
  const { text } = e.data;
  
  try {
    // Heavy parsing blocks this background thread, leaving the main UI buttery smooth
    const data = JSON.parse(text);
    self.postMessage({ success: true, data });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};