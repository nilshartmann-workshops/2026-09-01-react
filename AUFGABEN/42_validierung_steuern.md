# Wann validiert wird und wann Fehler erscheinen

## Dateien

- `src/components/PlantForm.tsx`
- `src/components/App.tsx` (ganz am Ende, für die Devtools)

## Aufgabe

Unser Formular meldet jeden Fehler sofort. Wer den ersten Buchstaben in ein leeres Formular tippt, hat sofort die Meldungen aller Pflichtfelder vor sich. Wir stellen das um: Bis zum ersten Absenden bleibt das Formular ruhig, danach meldet sich jedes Feld bei jeder Änderung.

## Schritte

1. Schau dir zuerst an, was gerade passiert: Lad die Seite neu, klick in das
   Feld "Name" und tipp einen einzigen Buchstaben. Der Standort ist noch leer,
   und seine Meldung steht schon da.

   Verantwortlich ist die Zeile aus der letzten Übung:

   ```tsx
   validators: {
     onChange: PlantFormState,
   }
   ```

   Das Schema prüft das **ganze** Formular, und `onChange` heißt "nach jeder
   Änderung an irgendeinem Feld".

2. Stell auf zwei Zeitpunkte um: bis zum ersten Absenden gar nicht prüfen,
   danach nach jeder Änderung. Dafür gibt es `revalidateLogic`:

   ```tsx
   import { revalidateLogic, useForm } from "@tanstack/react-form";

   const form = useForm({
     defaultValues,
     validationLogic: revalidateLogic(),
     validators: {
       onDynamic: PlantFormState,
     },
     // ...
   });
   ```

   - `validationLogic` entscheidet, welcher Validator bei welchem Ereignis
     läuft. Ohne die Option gilt die feste Zuordnung: `onChange` bei jeder
     Änderung, `onBlur` beim Verlassen eines Feldes, `onSubmit` beim Absenden.
   - ⚠️ **`onDynamic` statt `onChange`.** `revalidateLogic` sucht den Validator
     unter diesem Schlüssel. Bleibt das Schema unter `onChange` stehen, läuft es
     weiter nach der alten Regel, und es ändert sich gar nichts.

3. Probier den neuen Ablauf durch:
   - Seite neu laden und tippen: keine Meldung, nirgends.
   - Leeres Formular absenden: alle Meldungen erscheinen, und `onSubmit` läuft
     nicht.
   - "Name" ausfüllen: Die Meldung darunter verschwindet schon beim Tippen.
   - Vollständig ausfüllen und absenden: Das Formular ist wieder leer und wieder
     ruhig. `form.reset()` setzt die Zahl der Absende-Versuche mit zurück.

4. Verschieb die beiden Zeitpunkte einmal probeweise:

   ```tsx
   validationLogic: revalidateLogic({
     mode: "blur",
     modeAfterSubmission: "change",
   }),
   ```

   - `mode` gilt bis zum ersten Absende-Versuch (Voreinstellung `"submit"`),
     `modeAfterSubmission` danach (Voreinstellung `"change"`). Erlaubt sind beide
     Male `"change"`, `"blur"` und `"submit"`.
   - Mit `mode: "blur"` meldet sich ein Pflichtfeld schon, wenn man es leer
     wieder verlässt. Bei einem langen Formular ist das oft die freundlichere
     Wahl, weil der Fehler nicht erst ganz am Ende auftaucht.
   - Nimm das Argument danach wieder heraus, wir bleiben bei der Voreinstellung.

## Die Devtools

TanStack Form bringt Devtools mit, die den Formularzustand anzeigen. Ab hier lohnen sie sich, denn genau darum geht es von jetzt an.

Importier sie oben in `App.tsx`:

```tsx
import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
```

Und häng sie hinter das schließende `</TabBar>`:

```tsx
<TanStackDevtools plugins={[formDevtoolsPlugin()]} />
```

Unten rechts klappt jetzt ein Panel auf, links wählst du "TanStack Form". Das Formular erscheint dort erst, wenn sein Tab offen ist, und zwar unter einer erzeugten Kennung wie `_r_0_`. Klick sie an, dann siehst du je Feld `value` und `meta` und darunter den Status mit `canSubmit` und `submissionAttempts`. Zwei Warnungen über Schriften in der Konsole kommen aus den Devtools selbst und sind harmlos.

## Material

- Validierung in TanStack Form, dort steht auch `revalidateLogic`:
  <https://tanstack.com/form/latest/docs/framework/react/guides/validation>
- Der Formularzustand, aus dem die Logik ihre Entscheidung zieht:
  <https://tanstack.com/form/latest/docs/framework/react/reference/type-aliases/reactformextendedapi>
- Die Devtools für TanStack Form:
  <https://www.npmjs.com/package/@tanstack/react-form-devtools>
- Zum Vergleich dieselbe Frage bei React Hook Form (`mode` und
  `reValidateMode`): <https://react-hook-form.com/docs/useform>
