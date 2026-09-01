import PlantCard from "./PlantCard.tsx";
import { Plant } from "../types.ts";
import PlantCardList from "./PlantCardList.tsx";
import IntervalSelector from "./IntervalSelector.tsx";
import { useState } from "react";

export default function App() {

//  const allPlants: Array<Plant> = [
  const allPlants: Plant[] = [
    {
      id: "1",
      name: "Aloe Vera",
      location: "Schlafzimmer",
      wateringInterval: 12,
      lastWatered: "2026-08-28",
    },
    {
      id: "2",
      name: "Orchidee",
      location: "Wohnzimmer",
      wateringInterval: 20,
    },
    {
      id: "3",
      name: "Kaktus Karl",
      location: "Arbeitszimmer",
      wateringInterval: 21,
      lastWatered: "2026-07-15",
    },
  ];
  const [visible, setVisible] = useState(true)
  const [interval, setInterval] = useState<number|undefined>();


  
  // var s = ""; // Java!
  // s = null;  // Java!

  // Type inference TypeScript
  let s: string|null  = "";
  s = "...";
  s = null;



  return (
    <div className={"AppContainer"}>
      <button onClick={() => setVisible(!visible)}>Zeigen/Verstecken</button>

      {visible && <IntervalSelector interval={interval} onIntervalChange={setInterval}/>  }

      <p>Interval in App {interval}</p>

      <PlantCardList plants={allPlants} />
      {/*<PlantCard plant={*/}
      {/*  {id: "1", name: "Rose (Schatten)", location: "Küche", lastWatered: "2026-08-31", wateringInterval: 5}*/}
      {/*} />*/}
      {/*<PlantCard name={"Rose (Sonne)"} location={"Küche"} wateringInterval={1} />*/}
    </div>
  );
}
