import { ChangeEvent, useState } from "react";

export default function IntervalSelector() {
  const [interval, setInterval] = useState(1);

  const handleIntervalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const valueAsString = e.target.value;

    // Achtung: der Wert aus dem Event ist immer ein string!
    // (alternativ zu Number: parseInt)
    setInterval(Number(valueAsString));
  };

  // Validierung (z.B. keine negativen Zahlen) machen wir später

  return (
    <div className={"FormControl"}>
      <label>Gießintervall</label>
      <input type={"number"} value={interval} onChange={handleIntervalChange} />
      <button type={"button"} className={"sm"} onClick={() => setInterval(1)}>
        Täglich
      </button>
      <button type={"button"} className={"sm"} onClick={() => setInterval(7)}>
        Wöchentlich
      </button>
      <button type={"button"} className={"sm"} onClick={() => setInterval(14)}>
        Alle zwei Wochen
      </button>
      <div className={"px-1 text-sm"}>Alle {interval} Tage gießen</div>
    </div>
  );
}
