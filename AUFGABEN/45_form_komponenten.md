# Eigene Feld-Komponenten mit createFormHook

## Dateien

- `src/components/app-form.tsx` (anlegen!)
- `src/components/PlantForm.tsx`

## Aufgabe

Jedes Feld hat viel Boilerplate-Code, um den Wert zu binden, die Fehlerklasse zu setzen und die Meldung darunter anzuzeigen. Wir registrieren unsere Feld-Komponenten **einmal** und bekommen dafür einen eigenen `useAppForm`-Hook zurück.

## Schritte

1. Leg `src/components/app-form.tsx` an und richte die Contexts ein:

   ```tsx
   import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

   const { fieldContext, formContext, useFieldContext } =
     createFormHookContexts();
   ```

   - `useFieldContext` ist der Hook, mit dem die Feld-Komponenten unten an ihr Feld kommen. Außerhalb eines Feldes wirft er einen Fehler. Das ist genau das Paar aus Context und Hook, das wir für die `TabBar` von Hand geschrieben haben.
2. Schreib die Feld-Komponenten in dieselbe Datei. **Die kannst du dir hier kopieren**, sie enthalten nichts, was du nicht schon geschrieben hast. Es ist genau das, was bisher an jedem Feld stand:

   ```tsx
   type FormError = { message: string } | undefined;

   function ErrorMessage({ errors }: { errors: FormError[] }) {
     const error = errors[0];

     if (!error) {
       return null;
     }

     return <span className={"error-message"}>{error.message}</span>;
   }

   function TextField({ label }: { label: string }) {
     const field = useFieldContext<string>();

     return (
       <div className={"FormControl"}>
         <label>{label}</label>
         <input
           name={field.name}
           value={field.state.value}
           onBlur={field.handleBlur}
           onChange={(e) => field.handleChange(e.target.value)}
           className={field.state.meta.errors.length > 0 ? "error" : undefined}
         />
         <ErrorMessage errors={field.state.meta.errors} />
       </div>
     );
   }

   function SelectField({
     label,
     placeholder,
     options,
   }: {
     label: string;
     placeholder: string;
     options: string[];
   }) {
     const field = useFieldContext<string>();

     return (
       <div className={"FormControl"}>
         <label>{label}</label>
         <select
           name={field.name}
           value={field.state.value}
           onBlur={field.handleBlur}
           onChange={(e) => field.handleChange(e.target.value)}
           className={field.state.meta.errors.length > 0 ? "error" : undefined}
         >
           <option value={""}>{placeholder}</option>
           {options.map((option) => (
             <option key={option} value={option}>
               {option}
             </option>
           ))}
         </select>
         <ErrorMessage errors={field.state.meta.errors} />
       </div>
     );
   }

   function DateField({ label }: { label: string }) {
     const field = useFieldContext<string | undefined>();

     return (
       <div className={"FormControl"}>
         <label>{label}</label>
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
           className={field.state.meta.errors.length > 0 ? "error" : undefined}
         />
         <ErrorMessage errors={field.state.meta.errors} />
       </div>
     );
   }

   function IntervalField() {
     const field = useFieldContext<number>();

     return (
       <div className={"FormControl"}>
         <IntervalSelector
           interval={field.state.value}
           onIntervalChange={field.handleChange}
           error={field.state.meta.errors.length > 0}
         />
         <ErrorMessage errors={field.state.meta.errors} />
       </div>
     );
   }
   ```

   - Der Unterschied zu vorher ist **eine** Zeile pro Komponente:
     `const field = useFieldContext<...>()` statt `field` als Property.
   - Der Typparameter an `useFieldContext` sagt, welchen Werttyp die Komponente
     erwartet. Er wird **nicht** gegen das Feld geprüft, an dem du sie später
     benutzt.
   - `IntervalSelector` musst du importieren.
3. Registrier die Komponenten und exportier den Hook:

   ```tsx
   export const { useAppForm, withForm } = createFormHook({
     fieldContext,
     formContext,
     fieldComponents: { TextField, SelectField, DateField, IntervalField },
     formComponents: {},
   });
   ```

   - `withForm` brauchen wir hier noch nicht, aber später.
   - Setz ganz oben in die Datei ein
     `/* eslint-disable react-refresh/only-export-components */`.
4. Stell `PlantForm.tsx` um:
   - `useForm` wird zu `useAppForm` (Import aus `./app-form.tsx`). Am Aufruf
     selbst ändert sich **nichts**: `defaultValues`, `validationLogic`,
     `validators` und `onSubmit` bleiben, wie sie sind.
   - Aus jedem `<form.Field>` wird ein `<form.AppField>`, und in der
     Render-Prop steht nur noch die registrierte Komponente:

     ```tsx
     <form.AppField name={"name"}>
       {(field) => <field.TextField label={"Name der Pflanze"} />}
     </form.AppField>
     ```

   - Die Liste der Standorte gibst du als Property an das `SelectField`.
   - `ErrorMessage`, `locations` als `<option>`-Schleife und die `FormControl`-`div`s fliegen aus `PlantForm.tsx` raus, sie stehen jetzt in den Komponenten.
5. Probier es aus. Das Formular muss sich **genau wie vorher** verhalten:
   Validierung, Fehlermeldungen, roter Rahmen, Zurücksetzen.
6. 🧐 Zähl die Zeilen von `PlantForm.tsx` vorher und nachher. Und dann die
   Gegenrechnung: Wie viele Zeilen sind in `app-form.tsx` dazugekommen? Ab
   welchem Formular lohnt sich der Tausch?
7. 🧐 Der Haken: Schreib versehentlich `<field.TextField />` in das Feld
   `wateringInterval` (das ist eine Zahl, nicht ein String). Sagt TypeScript
   etwas? Und was passiert im Browser?

## Material

- Form Composition (`createFormHook`, `withForm`):
  <https://tanstack.com/form/latest/docs/framework/react/guides/form-composition>
- `createFormHookContexts`:
  <https://tanstack.com/form/latest/docs/framework/react/reference/functions/createformhookcontexts>
