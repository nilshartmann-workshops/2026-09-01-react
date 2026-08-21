import { Plant } from "../types.ts";
import IntervalSelector from "./IntervalSelector.tsx";

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

export default function App() {
  return (
    <div className={"AppContainer"}>
      <IntervalSelector />

      {/*<PlantCardList plants={allPlants} />*/}
    </div>
  );
}
