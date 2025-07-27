// sse-client.js

// const evtSource = new EventSource("http://localhost:8000/api/data");
const evtSource = new EventSource("https://freshsse.deno.dev/api/data");

evtSource.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);

    if (typeof document !== "undefined") {
      const elem = document.getElementById("dataItem");
      if (elem) {
        elem.textContent = JSON.stringify(data);
      }
    }
  } catch (error) {
    console.error("Failed to parse SSE data:", error);
  }
};

evtSource.onerror = (event) => {
  console.error("SSE error:", event);
  evtSource.close();
};