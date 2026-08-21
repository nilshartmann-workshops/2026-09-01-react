import PlantCard from "./PlantCard.tsx";

export default function App() {
  return (
    <div className={"AppContainer"}>
      <PlantCard
        name={"Aloe Vera"}
        location={"Schlafzimmer"}
        wateringInterval={12}
        lastWatered={"2026-08-28"}
      />

      <PlantCard
        name={"Orchidee"}
        location={"Wohnzimmer"}
        wateringInterval={20}
      />
    </div>
  );
}
