# Validierung mit zod

## Dateien

- `src/components/PlantFormState.types.ts`
- `src/components/PlantForm.tsx`


## Aufgabe

- Beschreib die Regeln für das Formular in einem zod-Schema und hänge es als Validator an das Formular
- Zeig die Fehlermeldungen an den Feldern an


## Schritte

1. Ersetz in `PlantFormState.types.ts` den handgeschriebenen Typ durch ein
   Schema:

   ```ts
   import { z } from "zod";

   export const PlantFormState = z.object({
     name: z.string().nonempty("Bitte gib den Namen deiner Pflanze ein"),
     // ... und so weiter für die anderen drei Felder
   });
   export type PlantFormState = z.infer<typeof PlantFormState>;
   ```

   Regeln, an die du dich halten kannst:

   | Feld | Regel |
   |---|---|
   | `name` | nicht leer |
   | `location` | nicht leer |
   | `wateringInterval` | Zahl, mindestens 1 |
   | `lastWatered` | optionales ISO-Datum (`z.iso.date()`) |

   - Schreib zu jeder Regel eine **sprechende Fehlermeldung** dazu, 
     sie ist das erste Argument (bzw. bei `.min()` das zweite).
   - Der `export`-Name bleibt derselbe wie vorher. In `PlantForm.tsx` musst du deshalb am Import nichts ändern und an den `defaultValues` auch nicht. Sie werden weiterhin mit `PlantFormState` annotiert, nur kommt der Typ jetzt aus dem Schema statt von Hand.
2. Häng das Schema als Validator ein:

   ```tsx
   const form = useForm({
     defaultValues,
     validators: {
       onChange: PlantFormState,
     },
     // ...
   });
   ```

3. Zeig die Fehlermeldungen an. Die Fehler eines Feldes stehen in

   ```tsx
   field.state.meta.errors;
   ```

   Das sind die **zod-Issues** für dieses Feld, also Objekte, keine Strings. Ein Issue hat unter anderem ein `message`, und einen `path`. Zeig die `message` des ersten Fehlers (falls vorhanden) und dem zugehörigen Feld an. Achtung: `errors` kann `undefined` sein.
4. Probier es aus: Submitte ein **leeres** Formular.
   - Es erscheinen sofort alle Fehlermeldungen. Das liegt daran, dass
   die Validierung auch vor dem Submit ausgeführt wird (nicht nur bei `onChange`)
5. Achtung! Datumsfeld... 🙄 🙀
   - Ein leeres `input type="date"` liefert als `value` einen **Leerstring**, 
     kein `undefined`. Und `z.iso.date().optional()` lehnt den Leerstring ab, 
     denn `optional()` bedeutet `undefined` und nicht "leer".
   - Konvertier direkt im Feld:

     ```tsx
     onChange={(e) =>
       field.handleChange(e.target.value === "" ? undefined : e.target.value)
     }
     ```

6. Zurücksetzen des Formulars dazu:
   - Ein zweiter Button ins `<div className="FormButtons">`, vor den
     Absende-Button: "Eingaben zurücksetzen 🧹", muss bei `onClick` 
     `form.reset()` auf rufen.
9. Prüf zum Schluss: Füll das Formular korrekt aus und schick es ab. In der
   Konsole muss dann das Objekt mit den Formularinhalten stehen.

## Material

- zod, Grundlagen: <https://zod.dev/basics>
- Eigene Fehlermeldungen: <https://zod.dev/error-customization>
- `z.infer`: <https://zod.dev/api?id=infer>
- Validierung in TanStack Form:
  <https://tanstack.com/form/latest/docs/framework/react/guides/validation>
- Standard Schema (der Vertrag, über den zod und TanStack Form sich verstehen):
  <https://standardschema.dev>

## Hintergrund

### `z.infer` oder `z.input`?

`z.infer<typeof Schema>` liefert den Typ, der beim Parsen **herauskommt**, also den Ausgabetyp. Bei einem Schema, das nur prüft (so wie unserem), sind Eingabe und Ausgabe gleich, und `z.infer` ist genau richtig.

Sobald ein Schema aber etwas *verändert*, gehen die beiden auseinander:

```ts
const S = z.object({
  wateringInterval: z.coerce.number(), // wandelt um
  tags: z.array(z.string()).default([]), // setzt einen Wert ein
});

z.input<typeof S>; // { wateringInterval: unknown; tags?: string[] }
z.infer<typeof S>; // { wateringInterval: number;  tags: string[] }
```

Für die `defaultValues` ist der **Eingabetyp** der richtige: Im Formular steht das, was der Benutzer eingibt, *bevor* das Schema es umwandelt. Wer also `z.coerce`, `.default()` oder `.transform()` benutzt, sollte `z.input<typeof PlantFormState>` nehmen. Dasselbe gilt für das `value` in `onSubmit`, denn TanStack Form validiert mit dem Schema und ersetzt den Formularzustand nicht durch das Ergebnis. Willst du dort den umgewandelten Wert, musst du selbst parsen: `const daten = PlantFormState.parse(value)`.

### Wo zod sonst noch auftaucht

Ein Schema ist mehr als eine Formularregel: Es prüft zur **Laufzeit**, was TypeScript nur zur Compile-Zeit behaupten kann. Deshalb setzt man zod gern überall dort ein, wo Daten von außen ins Programm kommen: Antworten einer REST-API, Werte aus `localStorage`, URL-Parameter, Umgebungsvariablen.

Bei uns kommen die Daten über GraphQL herein, und da haben wir schon einen
Vertrag: das Schema, aus dem wir die Typen generieren lassen. Deshalb ist das
Formular hier die einzige Stelle, an der zod vorkommt.

### Client-Validierung ist Komfort, keine Wahrheit

Alles, was du hier baust, läuft im Browser, und im Browser läuft nichts, was ein
Angreifer nicht abschalten könnte. Client-Validierung ist dazu da, dem Benutzer
schnell und freundlich Rückmeldung zu geben. Die verbindliche Prüfung passiert
auf dem Server. Später sehen wir beides nebeneinander: Unser Schema lässt einen
Pflanzennamen aus lauter Großbuchstaben durch, das Backend lehnt ihn ab.
