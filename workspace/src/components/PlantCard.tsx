export default function PlantCard() {
  // JSX

  // return React.createElement("div", React.createElement("h1", "Hello World"))

  return (
    <div className={"PlantCard"}>
      <header>
        <h2>Aloe Vera</h2>
        <div>📍Schlafzimmer</div>
      </header>
      <section>
        <div>Alle 5 Tage gießen</div>
        <div>Zuletzt: 24.06.2026</div>
      </section>
    </div>
  );
}
