import { useState } from "react";

// let zahl = 7;

export default function IntervalSelector() {
  // Kontrollierte                     (vs unkontrolliertes)

  // Zustand State  (Model)
  //  |  124    |   setInterval
  //  |  "tage"    |   setSetPeriodState

  // const state = useState(123);
  // const interval = state[0];   // 123
  // const setInterval = state[1];

  const [interval, setInterval] = useState(123); // Array Destrukturierung

  // const msg = `Sie müssen die Pflanze alle ${interval} Tage gießen`

  return (
    <div className={"FormControl"}>
      <label>Gießintervall</label>
      <input
        type={"number"}
        value={interval}
        onChange={(event) => {
          console.log("1");
          setInterval(parseInt(event.target.value));
          console.log("2");
        }}
      />
      <button
        type={"button"}
        className={"primary"}
        onClick={() => {
          setInterval(interval + 1);
        }}
      >
        {" "}
        +1{" "}
      </button>
      <IntervalMsg interval={interval} />
    </div>
  );
}

type IntervalMsgProps = {interval: number}
function IntervalMsg(props: IntervalMsgProps) {
  return <p>!!!!!! Sie müssen alle {props.interval} Tage gießen !!!!</p>

}
