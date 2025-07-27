// components/WakeLockIsland.tsx
/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

export default function WakeLockIsland() {
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let wakeLock: any = null;

    // Funktion zum Anfragen des Wake Locks
    async function requestWakeLock() {
      try {
        // Überprüfen ob api verfügbar ist
        if ("wakeLock" in navigator) {
          wakeLock = await (navigator as any).wakeLock.request("screen");
          setWakeLockActive(true);

          wakeLock.addEventListener("release", () => {
            setWakeLockActive(false);
            console.log("Wake Lock wurde freigegeben");
          });

          console.log("Wake Lock ist aktiv");
        } else {
          setError("Wake Lock API wird von diesem Browser nicht unterstützt.");
        }
      } catch (err) {
        setError("Fehler beim Anfragen des Wake Locks: " + err);
      }
    }

    // Wake Lock anfragen
    requestWakeLock();

    // Wake Lock nach Tab-Wechsel ggf. neu anfragen
    function handleVisibilityChange() {
      if (document.visibilityState === "visible" && !wakeLockActive) {
        requestWakeLock();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, []);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Wake Lock Status: {wakeLockActive ? "Aktiv" : "Inaktiv"}</p>
    </div>
  );
}
