import { useState } from "react";
import {
  createFormHook,
  createFormHookContexts,
  revalidateLogic,
  useForm,
} from "@tanstack/react-form";
import IntervalSelector from "./IntervalSelector.tsx";
import { PlantFormState } from "./PlantFormState.ts";
import { getDaysUntilWatering } from "./date-utils.ts";


const defaultValues: PlantFormState = {
    name: "",
    location: "",
    wateringInterval: 1,
    lastWatered: undefined, // "2026-09-03" ""
  };



export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextInput, IntervalSelector},
  formComponents: {},
});


type TextInputProps = {
  label: string;
}
function TextInput(props: TextInputProps) {
  console.log("Rendering TextInput", props.label, new Date().toLocaleTimeString())
  const field = useFieldContext<string>()

  return <div className={"FormControl"}>
    <label>{props.label}</label>
    <input value={field.state.value}
           onBlur={ () => field.handleBlur()}
           onChange={(e) => field.handleChange(e.target.value)} />
    <div className={"error-message"}>{field.state.meta.errors[0]?.message}</div>
  </div>
}


export default function PlantForm() {
  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: PlantFormState,
      // onBlur: PlantFormState
    },
    onSubmit: values => {
      console.log("Aktuelle Daten im Formular", values.value)
    }
  });

  console.log("Rendering Formular", new Date().toLocaleTimeString())

  // react hook form (Platzhirsch)
  // TanStack Form (neu)

  return (
    <form onSubmit={e => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    }}>

      <form.AppField name={"name"} children={field =>
        <field.TextInput label={"Name der Pflanze"}/>
      }
      />

      <form.AppField name={"location"} children={field =>
        <field.TextInput label={"Standort"}/>
      } />

      <form.AppField name={"wateringInterval"}>
        { (field) => {
          return <div className={"FormControl"}>
            <label>Gießen alle ... Tage</label>
            <field.IntervalSelector />
        </div>
        }}
      </form.AppField>

      <form.Field name={"lastWatered"}>
        { (field) => {
          return <div className={"FormControl"}>
            <label>Zuletzt gewässert</label>
            <input type={"date"}
                  value={field.state.value ?? ""}
                   onBlur={ () => field.handleBlur()}
                   onChange={(e) => field.handleChange(
                     e.target.value === "" ? undefined : e.target.value)
                   } />
          </div>
        }}
      </form.Field>

      <form.Subscribe
        selector={(state) => {
          console.log("Selector!!!", new Date().toLocaleTimeString())
          return state.values.lastWatered
            ? getDaysUntilWatering(
                state.values.lastWatered,
                state.values.wateringInterval,
              )
            : undefined;
        }
        }
      >
        {value => {
          console.log("Rendering ", value, new Date().toLocaleTimeString())
          return <p>{value}</p>;
        }}

      </form.Subscribe>

      <div className={"FormButtons"}>
        <button
          type={"submit"}
          className={"primary"}
        >
          Pflanze hinzufügen 🌱
        </button>

        <button type={"reset"} onClick={() => form.reset()}>
          Zurücksetzen
        </button>

      </div>
    </form>
  );
}
