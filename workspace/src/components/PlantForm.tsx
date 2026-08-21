import { useState } from "react";

/**
 * Platzhalter für das Formular, mit dem später Pflanzen angelegt werden. Die
 * Eingaben landen bisher nur auf der Konsole.
 */
export default function PlantForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [wateringInterval, setWateringInterval] = useState(1);

  const onSaveClick = () => {
    console.log("Speichern:", { name, location, wateringInterval });
  };

  return (
    <form>
      <div className={"FormControl"}>
        <label>Name der Pflanze</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className={"FormControl"}>
        <label>Standort</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>

      <div className={"FormControl"}>
        <label>Gießen alle ... Tage</label>
        <input
          type={"number"}
          value={wateringInterval}
          onChange={(e) => setWateringInterval(Number(e.target.value))}
        />
      </div>

      <div className={"FormButtons"}>
        <button
          type={"button"}
          className={"primary"}
          onClick={() => onSaveClick()}
        >
          Pflanze hinzufügen 🌱
        </button>
      </div>
    </form>
  );
}
