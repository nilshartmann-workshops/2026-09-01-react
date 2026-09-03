# Das Formular aufteilen

## Dateien

- `src/components/PlantFormFields.tsx` (anlegen!)
- `src/components/PlantForm.tsx`

## Aufgabe

`PlantForm.tsx` beschreibt inzwischen alle Felder, die Live-Berechnung und das Absenden in einem Stück. Wir schneiden die Felder heraus, in zwei fachliche Gruppen: **Stammdaten** (Name, Standort) und **Gießzeitraum** (Intervall, letztes Gießen, nächster Termin).

Am Ende steht in `PlantForm` nur noch:

```tsx
<StammdatenFields form={form} />
<GiessdatenFields form={form} />
```

## Das Problem beim Aufteilen

Eine Feldgruppe braucht das `form`-Objekt. Es als Property hereinzugeben ist einfach, bis man den **Typ** dafür hinschreiben soll. Der Typ eines Formulars enthält sein Datenmodell und jeden Validator, das sind zwölf Typparameter. Von Hand schreibt man das nicht auf.

TanStack Form löst das mit `withForm`. Man gibt ihm dieselben Optionen, mit denen das Formular gebaut wird, und bekommt eine Komponente zurück, die ein passendes `form` erwartet, mit allen Typen daran.

Damit beide dieselben Optionen benutzen können, wandern sie in eine gemeinsame Konstante.

## Schritte

1. Leg `src/components/PlantFormFields.tsx` an und zieh die gemeinsamen
   Optionen dorthin:

   ```tsx
   import { formOptions, revalidateLogic } from "@tanstack/react-form";

   const defaultValues: PlantFormState = {
     name: "",
     location: "",
     wateringInterval: 0,
     lastWatered: undefined,
   };

   export const plantFormOptions = formOptions({
     defaultValues,
     validationLogic: revalidateLogic(),
     validators: {
       onDynamic: PlantFormState,
     },
   });
   ```

   - `formOptions` tut zur Laufzeit nichts: Es gibt das Objekt zurück, das man hineingibt. Sein Zweck ist der Typ, denn daran hängt später, welche Feldnamen eine Gruppe kennen darf.
   - Die Liste `locations` zieht mit um, sie gehört zum Standort-Feld.
2. Bau die erste Gruppe:

   ```tsx
   export const StammdatenFields = withForm({
     ...plantFormOptions,
     render: ({ form }) => (
       <fieldset>
         <legend>Stammdaten</legend>
         {/* die beiden AppField-Blöcke aus PlantForm */}
       </fieldset>
     ),
   });
   ```

   - `withForm` importierst du aus `./app-form.tsx`, wir haben es dort schon mitexportiert.
   - Statt eines Funktionsrumpfes schreibst du `render`, und `form` kommt als
     Property herein. Darin ist alles wie gewohnt, `form.AppField` eingeschlossen.
   - Für das Aussehen reichen ein paar Tailwind-Klassen, im Projekt gibt es
     dafür keine eigenen:
     `className="space-y-6 rounded-lg border border-gray-200 p-4"` am
     `fieldset` und `className="px-2 text-sm font-semibold text-gray-700"` an
     der `legend`.
3. Bau die zweite Gruppe `GiessdatenFields` genauso: Gießintervall, letztes
   Gießen und das `form.Subscribe` mit dem Hinweis auf den nächsten Termin.
   - `NextWateringHint` zieht mit um. Sie wird nur hier gebraucht und muss
     deshalb nicht exportiert werden.
4. Räum `PlantForm.tsx` auf:
   - `defaultValues`, `locations` und `NextWateringHint` sind weg.
   - Der Hook-Aufruf nimmt die geteilten Optionen:

     ```tsx
     const form = useAppForm({
       ...plantFormOptions,
       onSubmit: async ({ value, formApi }) => { … },
     });
     ```

   - Im JSX stehen statt der vier Felder die beiden Gruppen, jede mit
     `form={form}`.
   - Das Absenden und die Buttons bleiben, wo sie sind. Sie gehören zum
     Formular als Ganzem, nicht zu einer Gruppe.
5. Probier es aus. Das Formular muss sich unverändert verhalten, auch die Validierung über beide Gruppen hinweg und das Zurücksetzen.
6. 🧐 Vertipp dich absichtlich in einem Feldnamen innerhalb einer Gruppe
   (`name={"nmae"}`). Bekommst du einen Fehler? Und woher weiß die Gruppe
   überhaupt, welche Namen es gibt?

## Material

- Form Composition, `withForm`:
  <https://tanstack.com/form/latest/docs/framework/react/guides/form-composition#breaking-big-forms-into-smaller-pieces>
- `formOptions`:
  <https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts#form-options>
- `withFieldGroup` (die wiederverwendbare Variante):
  <https://tanstack.com/form/latest/docs/framework/react/guides/form-composition#field-groups>
