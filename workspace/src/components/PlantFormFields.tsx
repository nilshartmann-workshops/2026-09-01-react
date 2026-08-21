/* eslint-disable react-refresh/only-export-components --
 * Die Feldgruppen und die gemeinsamen Formularoptionen stehen zusammen, damit
 * man beim Lesen sieht, worauf sich die Gruppen beziehen.
 */
import { formOptions, revalidateLogic } from "@tanstack/react-form";

import { withForm } from "./app-form.tsx";
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

// 💬 Erzählen: dieselben Optionen für das Formular und für seine Teile. Nur so
//    weiß eine Gruppe, welche Feldnamen es gibt.
export const plantFormOptions = formOptions({
  defaultValues,
  validationLogic: revalidateLogic(),
  validators: {
    onDynamic: PlantFormState,
  },
});

const sectionClass = "space-y-6 rounded-lg border border-gray-200 p-4";
const legendClass = "px-2 text-sm font-semibold text-gray-700";

export const StammdatenFields = withForm({
  ...plantFormOptions,
  // 💬 Erzählen: `render` statt eines Funktionsrumpfes, und `form` kommt als
  //    Property herein
  render: ({ form }) => (
    <fieldset className={sectionClass}>
      <legend className={legendClass}>Stammdaten</legend>

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
    </fieldset>
  ),
});

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

export const GiessdatenFields = withForm({
  ...plantFormOptions,
  render: ({ form }) => (
    <fieldset className={sectionClass}>
      <legend className={legendClass}>Gießzeitraum</legend>

      <form.AppField name={"wateringInterval"}>
        {(field) => <field.IntervalField />}
      </form.AppField>

      <form.AppField name={"lastWatered"}>
        {(field) => <field.DateField label={"Zuletzt gegossen"} />}
      </form.AppField>

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
    </fieldset>
  ),
});
