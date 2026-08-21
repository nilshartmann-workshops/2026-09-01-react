import { revalidateLogic } from "@tanstack/react-form";

import { useAppForm } from "./app-form.tsx";
import { getDaysUntilWatering } from "./date-utils.ts";
import { PlantFormState } from "./PlantFormState.types.ts";

const locations = [
  "Wohnzimmer",
  "Arbeitszimmer",
  "Küche",
  "Schlafzimmer",
  "Badezimmer",
  "Flur",
];

const defaultValues: PlantFormState = {
  name: "",
  location: "",
  wateringInterval: 0,
  lastWatered: undefined,
};

function NextWateringHint({ days }: { days: number | undefined }) {
  if (days === undefined) {
    return null;
  }

  if (days < 0) {
    return <p className={"error-message"}>Überfällig seit {-days} Tagen 🥀</p>;
  }

  if (days === 0) {
    return <p>Heute gießen 💧</p>;
  }

  return <p>Nächstes Gießen in {days} Tagen</p>;
}

export default function PlantForm() {
  // 💬 Erzählen: useAppForm statt useForm, sonst ändert sich am Aufruf nichts
  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: PlantFormState,
    },
    onSubmit: async ({ value, formApi }) => {
      console.log("Formulardaten:", value);
      formApi.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      {/* 💬 Zeigen: das war vorher 14 Zeilen. AppField statt Field, und die
          Render-Prop enthält nur noch die Komponente. */}
      <form.AppField name={"name"}>
        {(field) => <field.TextField label={"Name der Pflanze"} />}
      </form.AppField>

      <form.AppField name={"location"}>
        {(field) => (
          <field.SelectField
            label={"Standort"}
            placeholder={"Standort wählen..."}
            options={locations}
          />
        )}
      </form.AppField>

      <form.AppField name={"wateringInterval"}>
        {(field) => <field.IntervalField />}
      </form.AppField>

      <form.AppField name={"lastWatered"}>
        {(field) => <field.DateField label={"Zuletzt gegossen"} />}
      </form.AppField>

      {/* 💬 Erzählen: der Selektor gibt eine *Zahl* zurück, keinen Wert, der
          bei jedem Aufruf neu entsteht. Subscribe vergleicht mit ===. */}
      <form.Subscribe
        selector={(state) =>
          state.values.lastWatered
            ? getDaysUntilWatering(
                state.values.lastWatered,
                state.values.wateringInterval,
              )
            : undefined
        }
      >
        {(days) => <NextWateringHint days={days} />}
      </form.Subscribe>

      <div className={"FormButtons"}>
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
