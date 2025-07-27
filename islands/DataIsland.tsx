
/** @jsxRuntime classic */
/** @jsx h */
/*
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
      <h2>Live Data from Server (SSE)</h2>
      <pre
        style={{ whiteSpace: "pre-wrap", background: "#eee", padding: "1em", borderRadius: "8px" }}
      >
        {data ? JSON.stringify(data, null, 2) : "Waiting for data..."}
      </pre>
    </div>
  );
}
*/

/** @jsxRuntime classic */
/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export default function DataIsland() {
  const [data, setData] = useState<JsonValue | null>(null);

  useEffect(() => {
    const evtSource = new EventSource("/api/data");

    evtSource.onmessage = (event) => {
      try {
        // Parse event.data expecting any valid JSON value (object or atomic)
        const newData: JsonValue = JSON.parse(event.data);
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
      <h2>Live Data from Server (SSE)</h2>
      <pre
        style={{ whiteSpace: "pre-wrap", background: "#eee", padding: "1em", borderRadius: "8px" }}
      >
        {data !== null ? JSON.stringify(data, null, 2) : "Waiting for data..."}
      </pre>
    </div>
  );
}