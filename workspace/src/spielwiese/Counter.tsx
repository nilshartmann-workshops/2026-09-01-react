import { useEffect, useState } from "react";

// 1. Render Phase  => virtueller DOM  KEINE Seiteneffekte
// 2. Commit Phase => DOM aktualisiert Seiteneffekte ERLAUBT
export default function Counter() {
  const [appleCount, setAppleCount] = useState(0);
  const [orangeCount, setOrangeCount] = useState(0);

  useEffect(
    // Effekt-Callback-Funktion
    () => {
      const oldWindowTitle = window.document.title;

      console.log("Effekt wird ausgeführt!", new Date().toLocaleTimeString());

      window.document.title = `${appleCount} Äpfel`

      return () => {
        // Cleanup-Funktion
        window.document.title = oldWindowTitle;
      }
    },
    // Dependency-Array
    [appleCount]
  )

  return (
    <div
      className={"flex items-center gap-x-4 rounded-lg bg-white p-4 shadow-md"}
    >
      <span>🍎 {appleCount}</span>
      <span>🍊 {orangeCount}</span>
      <button
        className={"primary"}
        onClick={() => setAppleCount(appleCount + 1)}
      >
        Ein Apfel mehr
      </button>
      <button
        className={"secondary"}
        onClick={() => setOrangeCount(orangeCount + 1)}
      >
        Eine Orange mehr
      </button>
    </div>
  );
}
