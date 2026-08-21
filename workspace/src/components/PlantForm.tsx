import { useAppForm } from "./app-form.tsx";
import {
  GiessdatenFields,
  plantFormOptions,
  StammdatenFields,
} from "./PlantFormFields.tsx";

export default function PlantForm() {
  // 💬 Erzählen: Startwerte und Validierung kommen jetzt aus den geteilten
  //    Optionen, hier steht nur noch, was dieses Formular beim Absenden tut
  const form = useAppForm({
    ...plantFormOptions,
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
      <StammdatenFields form={form} />
      <GiessdatenFields form={form} />

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
