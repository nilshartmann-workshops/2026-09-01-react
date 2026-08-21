import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

import {
  CreatePlantDocument,
  GetPlantsDocument,
} from "../_generated-graphql-types.ts";
import { useAppForm } from "./app-form.tsx";
import {
  GiessdatenFields,
  plantFormOptions,
  StammdatenFields,
} from "./PlantFormFields.tsx";

// 💬 Erzählen: erste Operation mit einer *Variablen*, und der Rückgabetyp ist
//    eine Union. Ohne `... on ...` käme keine einzige Eigenschaft zurück.
const CREATE_PLANT_MUTATION = gql`
  mutation CreatePlant($input: CreatePlantInput!) {
    createPlant(input: $input) {
      ... on CreatePlantSuccess {
        plant {
          id
          name
          location
          wateringInterval
          lastWatered
        }
      }
      ... on CreatePlantError {
        msg
      }
    }
  }
`;

export default function PlantForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 💬 Erzählen: `loading` behandeln wir hier selbst, eine Mutation läuft
  //    nicht beim Rendern los
  // 💬 Fallstrick: `{ query: ... }`, nicht `[GetPlantsDocument]`. Sonst würden
  //    nur *aktive* Queries aktualisiert, und unsere Liste ist ausgehängt.
  const [createPlant, createPlantResult] = useMutation(CreatePlantDocument, {
    refetchQueries: [{ query: GetPlantsDocument }],
  });
  // 💬 Erzählen: Startwerte und Validierung kommen jetzt aus den geteilten
  //    Optionen, hier steht nur noch, was dieses Formular beim Absenden tut
  const form = useAppForm({
    ...plantFormOptions,
    onSubmit: async ({ value, formApi }) => {
      setSuccessMessage(null);
      setErrorMessage(null);

      try {
        const { data } = await createPlant({ variables: { input: value } });

        // 💬 Erzählen: __typename engt den Typ im if- und else-Zweig ein
        const result = data?.createPlant;
        if (result?.__typename === "CreatePlantSuccess") {
          setSuccessMessage(`"${result.plant.name}" wurde angelegt 🌱`);
          formApi.reset();
        } else {
          setErrorMessage(result?.msg ?? "Das hat leider nicht geklappt");
        }
      } catch (e) {
        // 💬 hier landet, was gar nicht erst beim Server ankommt
        setErrorMessage(e instanceof Error ? e.message : String(e));
      }
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

      {/* 💬 Erzählen: Server-Fehler über dem Formular, Feldgenaues von zod */}
      {successMessage && <p className={"success-message"}>{successMessage}</p>}
      {errorMessage && <p className={"error-message"}>{errorMessage}</p>}

      <div className={"FormButtons"}>
        <button
          type={"button"}
          className={"secondary"}
          onClick={() => form.reset()}
        >
          Eingaben löschen 🧹
        </button>
        <button
          type={"submit"}
          className={"primary"}
          disabled={createPlantResult.loading}
        >
          {createPlantResult.loading
            ? "Wird gespeichert..."
            : "Pflanze hinzufügen 🌱"}
        </button>
      </div>
    </form>
  );
}
