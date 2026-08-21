import { ChangeEvent } from "react";

type IntervalSelectorProps = {
  interval?: number;
  onIntervalChange(newInterval: number): void;
  // 💬 brauchen wir erst später, bei der Validierung im Formular
  error?: boolean;
};

export default function IntervalSelector({
  interval,
  onIntervalChange,
  error,
}: IntervalSelectorProps) {
  const handleIntervalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const valueAsString = e.target.value;

    // Achtung: der Wert aus dem Event ist immer ein string!
    // (alternativ zu Number: parseInt)
    onIntervalChange(Number(valueAsString));
  };

  // Validierung (z.B. keine negativen Zahlen) machen wir später

  return (
    <div className={"FormControl"}>
      <label>Gießintervall</label>
      <input
        type={"number"}
        // 💬 undefined darf hier nicht rein, sonst beschwert sich React
        value={interval ?? ""}
        onChange={handleIntervalChange}
        className={error ? "error" : undefined}
      />
      <button
        type={"button"}
        className={"sm"}
        onClick={() => onIntervalChange(1)}
      >
        Täglich
      </button>
      <button
        type={"button"}
        className={"sm"}
        onClick={() => onIntervalChange(7)}
      >
        Wöchentlich
      </button>
      <button
        type={"button"}
        className={"sm"}
        onClick={() => onIntervalChange(14)}
      >
        Alle zwei Wochen
      </button>
      {interval !== undefined && (
        <div className={"px-1 text-sm"}>Alle {interval} Tage gießen</div>
      )}
    </div>
  );
}
