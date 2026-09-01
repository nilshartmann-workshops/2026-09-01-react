import PlantCard from "./PlantCard.tsx";
import { Plant } from "../types.ts";
import PlantCardList from "./PlantCardList.tsx";

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

  return (
    <div className={"AppContainer"}>
      <PlantCardList plants={allPlants} />
      {/*<PlantCard plant={*/}
      {/*  {id: "1", name: "Rose (Schatten)", location: "Küche", lastWatered: "2026-08-31", wateringInterval: 5}*/}
      {/*} />*/}
      {/*<PlantCard name={"Rose (Sonne)"} location={"Küche"} wateringInterval={1} />*/}
    </div>
  );
}
