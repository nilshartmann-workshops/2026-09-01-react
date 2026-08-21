import { Plant } from "../types.ts";
import FavoritePlantList from "./FavoritePlantList.tsx";
import PlantCardList from "./PlantCardList.tsx";

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

export default function PlantList() {
  return (
    <div className={"PlantList"}>
      <div>
        <h2>Alle Pflanzen</h2>
        <PlantCardList plants={allPlants} />
      </div>
      <FavoritePlantList plants={allPlants} />
    </div>
  );
}
