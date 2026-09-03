import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import IntervalSelector from "./IntervalSelector.tsx";

type PlantFormState = {
  name: string,
  location: string,
  wateringInterval: number,
  lastWatered?: string | null,
}

const defaultValues: PlantFormState = {
    name: "Rose",
    location: "",
    wateringInterval: 1,
    lastWatered: null, // "2026-09-03" ""
  };


export default function PlantForm() {
  const form = useForm({
    defaultValues,
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
          </div>
        }}
      </form.Field>


        <form.Field name={"location"}>
        { (field) => {
          return <div className={"FormControl"}>
            <label>Standort</label>
            <input value={field.state.value}
                   onChange={(e) => field.handleChange(e.target.value)} />
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
                   onChange={(e) => field.handleChange(e.target.value)} />
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
      </div>
    </form>
  );
}
