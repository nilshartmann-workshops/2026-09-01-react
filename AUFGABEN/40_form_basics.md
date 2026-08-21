# Formulare mit TanStack Form

## Dateien

- `src/components/PlantForm.tsx`
- `src/components/PlantFormState.types.ts` (anlegen!)

## Aufgabe

Aus dem "Platzhalter""-Formular wird ein "echtes" Formular: Die Feldwerte verwaltet ab jetzt eine Bibliothek, und beim Absenden kommen wir an alle Daten auf einmal heran.

## Schritte

1. Schreib den Typ der Formularwerte auf, in eine eigene Datei
   `src/components/PlantFormState.types.ts`:

   ```ts
   export type PlantFormState = {
     name: string;
     location: string;
     wateringInterval: number;
     lastWatered?: string;
   };
   ```

   - Das ist der Zustand *dieses Formulars*, nicht eine Pflanze: keine `id`, die
     vergibt der Server.
   - Dass wir den Typ von Hand schreiben, ist übrigens nur ein Zwischenschritt, wir kommen darauf zurück.
2. Entferne in `PlantForm.tsx` die `useState`-Zeilen und den
   `onSaveClick`-Handler. State-Handling und Submitten übernimmt
   ab jetzt `useForm` von TanStack Form:

   ```tsx
   import { useForm } from "@tanstack/react-form";

   const defaultValues: PlantFormState = {
     name: "",
     location: "",
     wateringInterval: 0,
     lastWatered: undefined,
   };

   export default function PlantForm() {
     const form = useForm({
       defaultValues,
       onSubmit: async ({ value }) => {
         console.log("Formulardaten:", value);
       },
     });
     // ...
   ```

   - Aus den `defaultValues` leitet TanStack Form den Typ des Formulars ab, deshalb steht der Typ an den Startwerten und nicht am `useForm`-Aufruf.
   - Schreib eine **Typ-Angabe** (`const x: T = …`), keinen "Type Cast"
     (`... as T`). Die Typ-Angabe wird geprüft: Ein Tippfehler im Feldnamen oder
     ein vergessenes Feld fällt genau hier auf. Ein `as` winkt beides durch, und
     der Fehler taucht dann viel weiter unten an den Feldern auf.
   - **Der Submit-Handler steht in `useForm`**, nicht am `<form>`-Element.
3. Verbinde den Submit-Handler mit dem `<form>`-Element:

   ```tsx
   <form
     onSubmit={(e) => {
       e.preventDefault();
       void form.handleSubmit();
     }}
   >
   ```

4. Registriere die Felder an der Form. Jedes Feld steckt in einem `<form.Field>`:

   ```tsx
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
   ```

   - Zwischen den Tags steht eine **Funktion** (eine Render-Prop) und keine Komponente. Sie bekommt die Informationen über das angegebene Feld (`name`) und entscheidet selbst, wie sie die Informationen zum Rendern des UI-Elementes verwendet.
   - Diese vier Zeilen musst du für jedes Feld machen. Wir können uns später ansehen, 
     ob bzw. wie man das vereinfachen kann.
   - `name` wird gegen den Typ der `defaultValues` geprüft. Vertipp dich ruhig einmal absichtlich und schau, was TypeScript sagt.
5. Bau die restlichen drei Felder:

   | Feld | Element | Hinweis |
   |---|---|---|
   | `name` | `input` | |
   | `location` | `select` | feste Liste von Standorten, plus ein leerer Eintrag "Standort wählen..." |
   | `wateringInterval` | `IntervalSelector` | unsere eigene Komponente von vorhin |
   | `lastWatered` | `input type="date"` | |

   - Für das Gießintervall den `IntervalSelector`, den wir gebaut haben:

     ```tsx
     <form.Field name={"wateringInterval"}>
       {(field) => (
         <IntervalSelector
           interval={field.state.value}
           onIntervalChange={field.handleChange}
         />
       )}
     </form.Field>
     ```

   - Der `IntervalSelector` bringt sein eigenes `<div className="FormControl">` und sein eigenes Label schon mit, pack ihn also nicht noch einmal ein.
   - Beim Datumsfeld brauchst du `value={field.state.value ?? ""}`: der Wert (`field.state.value`) darf laut unserer Typ-Beschreibung undefined sein. Das `value`-Property am Eingabefeld darf in unserem Fall aber **nicht** `undefined` sein. Also setzen wir bei einem nicht vorhandenen Wert einfach einen Leerstring.
6. Einen Button ans Ende, in ein `<div className="FormButtons">`: "Pflanze hinzufügen 🌱", mit `type="submit"` und der CSS-Klasse `primary`.
7. Probier es aus: Formular ausfüllen, absenden, in die Konsole schauen. Dort
   sollte jetzt ein Objekt mit allen vier Feldern stehen. Auch die
   Schnellwahl-Buttons des `IntervalSelector` ("Täglich", "Wöchentlich", "Alle
   zwei Wochen") landen im Formularzustand.
9. 🧐 Optional (wenn du noch Zeit hast): Häng ein `console.log("Feld name rendert")` in die Render-Prop des `name`-Feldes und tipp dann im `location`-Feld. Was passiert, und was wäre passiert, wenn das Formular seinen Zustand mit einem einzigen `useState` in `PlantForm` halten würde?

## Material

- TanStack Form, Überblick:
  <https://tanstack.com/form/latest/docs/overview>
- `useForm`: <https://tanstack.com/form/latest/docs/framework/react/reference/functions/useform>
- Die `Field`-API:
  <https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts>

## Hintergrund: Woher der Typ des Formulars kommt

Den Typ der Formularwerte leitet TanStack Form aus den `defaultValues` ab.

Die Ableitung funktioniert, solange jeder initial Wert gesetzt wird.
Beispiel: aus `""` kann TypeScript `string` ableiten, aus `0` `number`, aus `false`  `boolean` etc. In diesen Fällen geht es aber nicht:

| Startwert | abgeleitet würde | gemeint war |
|---|---|---|
| `undefined` | `undefined` | `string \| undefined` |
| `null` | `null` | `string \| null` |
| `[]` | `never[]` | `Tag[]` |
| `""` in einem Select mit fester Werteliste | `string` | `"Küche" \| "Flur" \| …` |

Da es nicht ungewöhnlich ist, dass ein Formular keine "vernünftigen" Initialwerte hat, 
bauen wir den Typ für das Formular (`PlantFormState`). Dann weiß TypeScript z.B. wenn `lastWatered` initial `undefined` ist, wäre auch ein `string` gültig für das Feld.

