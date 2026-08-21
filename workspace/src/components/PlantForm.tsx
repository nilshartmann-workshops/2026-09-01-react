import { useForm } from "@tanstack/react-form";

import IntervalSelector from "./IntervalSelector.tsx";
import { PlantFormState } from "./PlantFormState.types.ts";

const locations = [
  "Wohnzimmer",
  "Arbeitszimmer",
  "Küche",
  "Schlafzimmer",
  "Badezimmer",
  "Flur",
];

// 💬 Annotation, nicht `as`: Die wird *geprüft*, ein Tippfehler im Feldnamen
//    fällt hier auf.
const defaultValues: PlantFormState = {
  name: "",
  location: "",
  wateringInterval: 0,
  lastWatered: undefined,
};

export default function PlantForm() {
  const form = useForm({
    defaultValues,
    // 💬 Erzählen: der Absende-Handler steht hier, nicht am <form>-Element
    onSubmit: async ({ value }) => {
      console.log("Formulardaten:", value);
    },
  });

  return (
    // 💬 Erzählen: handleSubmit ersetzt unser onSubmit nicht, es wird darin
    //    aufgerufen. preventDefault machen wir selbst.
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      {/* 💬 Erzählen: zwischen den Tags steht eine Funktion ("Render-Prop"),
          keine Komponente. Nebeneffekt: Beim Tippen rendert nur dieses Feld. */}
      <form.Field name={"name"}>
        {(field) => (
          <div className={"FormControl"}>
            <label>Name der Pflanze</label>
            <input
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name={"location"}>
        {(field) => (
          <div className={"FormControl"}>
            <label>Standort</label>
            <select
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            >
              <option value={""}>Standort wählen...</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        )}
      </form.Field>

      {/* 💬 Erzählen: dasselbe <form.Field> wie überall, nur mit unserer eigenen
          Komponente darin. handleChange geht direkt als onIntervalChange durch,
          weil der IntervalSelector seinen Zustand nicht selbst hält. */}
      <form.Field name={"wateringInterval"}>
        {(field) => (
          <IntervalSelector
            interval={field.state.value}
            onIntervalChange={field.handleChange}
          />
        )}
      </form.Field>

      <form.Field name={"lastWatered"}>
        {(field) => (
          <div className={"FormControl"}>
            <label>Zuletzt gegossen</label>
            {/* 💬 `?? ""`: undefined darf nicht als value an ein input */}
            <input
              type={"date"}
              name={field.name}
              value={field.state.value ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <div className={"FormButtons"}>
        <button type={"submit"} className={"primary"}>
          Pflanze hinzufügen 🌱
        </button>
      </div>
    </form>
  );
}
