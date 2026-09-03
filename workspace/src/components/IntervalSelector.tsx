import { useState } from "react";
import { useFieldContext } from "./PlantForm.tsx";


// Java
// @FunctionalInterface
// interface IntervalChangeListener {
//   void onIntervalChange(int newInterval)
// }

// class IntervalSelector {
//   render(IntervalChangeListener listener) {
//      listener.onIntervalChange(123);
//   }
// }

// IntervalSelector s = s.IntervalSelector();
// s.render(newInterval -> { /* ... */ })


// let zahl = 7;
type IntervalSelectorProps = {
  interval: number
  onIntervalChange: (newInterval: number) => void
}
export default function IntervalSelector() {
  // Kontrollierte                     (vs unkontrolliertes)

  // Zustand State  (Model)
  //  |  124    |   setInterval
  //  |  "tage"    |   setSetPeriodState

  // const state = useState(123);
  // const interval = state[0];   // 123
  // const setInterval = state[1];

  // const [interval, setInterval] = useState(123); // Array Destrukturierung

  // const msg = `Sie müssen die Pflanze alle ${interval} Tage gießen`

  const field = useFieldContext<number>()

  return (
    <div className={"FormControl"}>
      <label>Gießintervall</label>
      <input
        type={"number"}
        value={field.state.value}
        onChange={(event) => {
          field.handleChange(parseInt(event.target.value))
        }}
      />
      <button
        type={"button"}
        className={"primary"}
        onClick={() => {
          field.handleChange(field.state.value+1)
          // onIntervalChange(interval + 1);
        }}
      >
        {" "}
        +1{" "}
      </button>
      {/*<IntervalMsg interval={interval} />*/}
    </div>
  );
}

type IntervalMsgProps = {interval: number}
function IntervalMsg(props: IntervalMsgProps) {
  return <p>!!!!!! Sie müssen alle {props.interval} Tage gießen !!!!</p>

}
