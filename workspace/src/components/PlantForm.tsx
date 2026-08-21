import { revalidateLogic, useForm } from "@tanstack/react-form";

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
//    fällt hier auf. Der Typ kommt jetzt aus dem Schema.
const defaultValues: PlantFormState = {
  name: "",
  location: "",
  wateringInterval: 0,
  lastWatered: undefined,
};

// 💬 Erzählen: `errors` enthält die zod-Issues, keine Strings. Die Komponente
//    bekommt die Objekte und entscheidet, was sie davon anzeigt.
type FormError = { message: string } | undefined;

function ErrorMessage({ errors }: { errors: FormError[] }) {
  const error = errors[0];

  if (!error) {
    return null;
  }

  return <span className={"error-message"}>{error.message}</span>;
}

export default function PlantForm() {
  const form = useForm({
    defaultValues,
    // 💬 Fallstrick: revalidateLogic schaut nur unter onDynamic nach. Was
    //    unter onChange stehen bleibt, läuft weiter wie vorher.
    validationLogic: revalidateLogic(),
    // 💬 Erzählen: kein Adapter nötig, TanStack Form versteht "Standard
    //    Schema", und zod 4 spricht das
    validators: {
      onDynamic: PlantFormState,
    },
    onSubmit: async ({ value, formApi }) => {
      console.log("Formulardaten:", value);
      formApi.reset();
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
              className={
                field.state.meta.errors.length > 0 ? "error" : undefined
              }
            />
            <ErrorMessage errors={field.state.meta.errors} />
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
              className={
                field.state.meta.errors.length > 0 ? "error" : undefined
              }
            >
              <option value={""}>Standort wählen...</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <ErrorMessage errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      {/* 💬 Erzählen: dasselbe <form.Field> wie überall, nur mit unserer eigenen
          Komponente darin. handleChange geht direkt als onIntervalChange durch,
          weil der IntervalSelector seinen Zustand nicht selbst hält. */}
      <form.Field name={"wateringInterval"}>
        {(field) => (
          <div className={"FormControl"}>
            <IntervalSelector
              interval={field.state.value}
              onIntervalChange={field.handleChange}
              error={field.state.meta.errors.length > 0}
            />
            <ErrorMessage errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      <form.Field name={"lastWatered"}>
        {(field) => (
          <div className={"FormControl"}>
            <label>Zuletzt gegossen</label>
            {/* 💬 Ein geleertes Datumsfeld liefert "", und das lehnt
                z.iso.date().optional() ab */}
            <input
              type={"date"}
              name={field.name}
              value={field.state.value ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) =>
                field.handleChange(
                  e.target.value === "" ? undefined : e.target.value,
                )
              }
              className={
                field.state.meta.errors.length > 0 ? "error" : undefined
              }
            />
            <ErrorMessage errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      <div className={"FormButtons"}>
        {/* 💬 type="button" nicht vergessen, sonst ist er ein Submit-Button */}
        <button
          type={"button"}
          className={"secondary"}
          onClick={() => form.reset()}
        >
          Eingaben löschen 🧹
        </button>
        <button type={"submit"} className={"primary"}>
          Pflanze hinzufügen 🌱
        </button>
      </div>
    </form>
  );
}
