import PlantCard from "./PlantCard.tsx";

export default function App() {
  return (
    <div className={"AppContainer"}>
      <PlantCard name={"Rose (Schatten)"} location={"Küche"} lastWatered={"2026-08-31"} wateringInterval={5} />
      <PlantCard name={"Rose (Sonne)"} location={"Küche"} wateringInterval={1} />
    </div>
  );
}
