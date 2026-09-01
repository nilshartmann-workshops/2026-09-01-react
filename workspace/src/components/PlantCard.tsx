
// "Daten" einer Komponente -> props (properties)

// <PlantCard

// record PlantCardProps(String name, String location, String lastWatered, int wateringInterval) {}

type PlantCardProps = {
  name: string;
  location: string;
  lastWatered?: string;
  wateringInterval: number;
}

// function PlantCard(props: PlantCardProps) {
//
//   // const name = props.name;
//   // const location = props.location;
//
//   const {name, location } = props; // <-- Destructuring Operator
// }

// export default function PlantCard(props: PlantCardProps) {
export default function PlantCard( { name, location, lastWatered, wateringInterval } : PlantCardProps) {
  // Destructuring

  // JSX

  const lastWateredLabel = lastWatered
    ? `Zuletzt: ${lastWatered}`
    : "Noch nie gegossen";



  // Ausdruck     Anweisung
  //  {  JA }      nein!
  // Expression   Statement
  //  string        if (...) switch (...)
  //  1+2
  //  ?-Operator (Ternärer Operator) Elvis Operator


  // return React.createElement("div", React.createElement("h1", "Hello World"))

  return (
    <div className={"PlantCard"}>
      <header>
        <h2>{name}</h2>
        <div>📍{location}</div>
      </header>
      <section>
        <div>Alle {wateringInterval} Tage gießen</div>
        <div>{lastWatered
          ? `Zuletzt: ${lastWatered}`
          : "Noch nie gegossen"}</div>
      </section>
    </div>
  );
}
