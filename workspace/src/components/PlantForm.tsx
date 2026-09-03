import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import IntervalSelector from "./IntervalSelector.tsx";
import { PlantFormState } from "./PlantFormState.ts";


const defaultValues: PlantFormState = {
    name: "Rose",
    location: "",
    wateringInterval: 1,
    lastWatered: undefined, // "2026-09-03" ""
  };


export default function PlantForm() {
  const form = useForm({
    defaultValues,
    validators: {
      onChange: PlantFormState
    },
    onSubmit: values => {
      console.log("Aktuelle Daten im Formular", values.value)
    }
  });

  // react hook form (Platzhirsch)
  // TanStack Form (neu)

  return (
    <form onSubmit={e => {
      e.preventDefault();
      e.stopPropagation();

      form.handleSubmit();
    }}>
      <form.Field name={"name"}>
        { (field) => {
          return <div className={"FormControl"}>
            <label>Name der Pflanze</label>
            <input value={field.state.value}
                   onChange={(e) => field.handleChange(e.target.value)} />
            <div className={"error-message"}>{field.state.meta.errors[0]?.message}</div>
          </div>
        }}
      </form.Field>


        <form.Field name={"location"}>
        { (field) => {
          return <div className={"FormControl"}>
            <label>Standort</label>
            <input value={field.state.value}
                   onChange={(e) => field.handleChange(e.target.value)} />
            <div className={"error-message"}>{field.state.meta.errors[0]?.message}</div>

          </div>
        }}
        </form.Field>

      <form.Field name={"wateringInterval"}>
        { (field) => {
          return <div className={"FormControl"}>
            <label>Gießen alle ... Tage</label>
            <IntervalSelector interval={field.state.value}
                              onIntervalChange={(newInterval) => field.handleChange(newInterval)} />

        </div>
        }}
      </form.Field>

      <form.Field name={"lastWatered"}>
        { (field) => {
          return <div className={"FormControl"}>
            <label>Standort</label>
            <input type={"date"}
                  value={field.state.value ?? ""}
                   onChange={(e) => field.handleChange(
                     e.target.value === "" ? undefined : e.target.value)
                   } />
          </div>
        }}
      </form.Field>

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
