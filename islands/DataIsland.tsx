/** @jsxRuntime classic */
/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

export default function DataIsland() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const evtSource = new EventSource("/api/data");

    evtSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setData(newData);
      } catch {
        // ignore parse errors
      }
    };

    evtSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      evtSource.close();
    };

    return () => {
      evtSource.close();
    };
  }, []);

  return (
    <div>
      <h2>Live Data from Server ( S S E )</h2>
      <pre
        style={{ whiteSpace: "pre-wrap", background: "#eee", padding: "1em", borderRadius: "28px" }}
      >
        {data ? JSON.stringify(data, null, 2) : "Waiting for data..."}
      </pre>
    </div>
  );
}
