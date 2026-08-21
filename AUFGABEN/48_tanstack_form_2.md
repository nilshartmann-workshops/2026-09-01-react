# Ausblick: Was sich in TanStack Form 2 ändert

## Dateien

Keine. Hier wird nichts programmiert, wir schauen nur darauf, wie das, was wir gebaut haben, in der nächsten Hauptversion aussieht.

## Aufgabe

Alles, was wir am Formular geschrieben haben, ändert sich in Version 2 mindestens in der Schreibweise. Das ist kein Grund zur Sorge, aber es lohnt sich zu wissen, welche Stellen es trifft und warum. Die meisten Änderungen sind keine Umbenennungen, sondern Antworten auf eine Frage, an der wir uns unterwegs gestoßen haben.

## Wo Version 2 gerade steht

Auf npm zeigt `latest` weiterhin auf eine 1er-Version. Version 2 gibt es unter dem Tag `alpha`, und der Stand, den dieser Text beschreibt, ist `2.0.0-alpha.2`. An Einzelheiten kann sich also noch etwas ändern.

Praktisch heißt das: Ein Projekt, das heute anfängt, nimmt die 1. Wer das hier liest, sollte nur wissen, welche Stellen beim Umstieg anzufassen sind.

## Die Feldbindung wird kürzer

An jedem Feld standen bei uns `field.state.value` und `field.state.meta.errors`. Das Zwischenstück `state` fällt weg:

```tsx
// Version 1
<input
  value={field.state.value}
  onChange={(e) => field.handleChange(e.target.value)}
/>;
field.state.meta.errors;

// Version 2
<input
  value={field.value}
  onChange={(e) => field.handleChange(e.target.value)}
/>;
field.errors;
```

Ein Detail am Rande, das uns betrifft: Wir haben uns den Typ der Fehler selbst hingeschrieben, weil der echte Typ ein langer berechneter Ausdruck war.

```tsx
type FormError = { message: string } | undefined;
```

In Version 2 heißt genau dieser Typ `ValidationIssue` und wird exportiert. Unsere eigene Beschreibung war also nicht falsch, sie war nur die Handarbeit, die vorher nötig war.

## Aus dem Validator-Objekt wird eine Liste

So sah unser Validator aus, und daneben steht dieselbe Regel in Version 2:

```tsx
// Version 1
validators: {
  onChange: PlantFormState,
}

// Version 2
validators: [{ run: PlantFormState, triggers: ["change"] }]
```

Der Gewinn ist nicht die Schreibweise, sondern dass mehrere Validatoren nebeneinander stehen können, jeder mit seinen eigenen Zeitpunkten. In Version 1 gibt es je Zeitpunkt genau einen Platz: Wer zwei Regeln bei `onChange` prüfen will, muss sie in ein Schema zusammenfassen.

Ein Validator kann außerdem einen einzelnen Zeitpunkt an eine Bedingung knüpfen, zum Beispiel "bei jeder Änderung, aber nur solange dieses Feld schon einen Fehler hat".

## Wann geprüft wird und wann Fehler erscheinen

Das ist die Stelle, an der Version 2 am meisten verändert, und sie betrifft genau die Übung, in der wir `revalidateLogic` eingebaut haben.

Wir haben dort gesehen, dass zwei Fragen zusammenfallen: Ob geprüft wird, entscheidet auch darüber, ob eine Meldung dasteht. Deshalb hat `revalidateLogic` die Prüfung selbst verschoben, obwohl wir eigentlich nur die Anzeige verschieben wollten. Der Preis dafür war, dass das Formular bis zum ersten Absenden nicht weiß, ob es gültig ist.

Version 2 trennt die beiden Fragen. `validationLogic`, `revalidateLogic` und `onDynamic` gibt es nicht mehr. An ihrer Stelle steht eine Option, die nur über die Anzeige entscheidet:

```tsx
const form = useForm({
  defaultValues,
  errorVisibility: ({ state, fieldState }) =>
    fieldState.meta.isBlurred || state.submissionAttempts > 0,
  validators: [{ run: PlantFormState, triggers: ["change"] }],
});
```

Gelesen: Geprüft wird bei jeder Änderung, angezeigt wird erst, wenn das Feld einmal verlassen wurde oder das Formular einmal abgeschickt wurde. Das ist keine Auswahl aus festen Werten, sondern eine Funktion, die den Formularzustand und den Zustand des Feldes bekommt.

Damit lässt sich auch das bauen, was in Version 1 unbequem war: durchgehend prüfen, den Absende-Button danach sperren, und trotzdem erst später etwas anzeigen.

## Feld-Komponenten: der Werttyp wird geprüft

Unsere `app-form.tsx` baut auf `createFormHookContexts()` auf, und jede Feld-Komponente holt sich ihr Feld mit `useFieldContext<string>()`. Wir haben dort auch gesehen, was das kostet: Der Typparameter ist eine Behauptung. Ein `<field.TextField />` am Zahlenfeld sagt TypeScript nichts.

In Version 2 gibt es das Context-Paar nicht mehr. Eine Feld-Komponente nimmt ihr Feld wieder als ganz normales Property entgegen, und beim Registrieren sagt man, welches Property das ist:

```tsx
import { createFormHook, getFormHookHelpers } from "@tanstack/react-form";
import type { FieldWithValue } from "@tanstack/react-form";

function TextInput({
  field,
  label,
}: {
  field: FieldWithValue<string>;
  label: string;
}) {
  // ... dasselbe JSX wie in unserem TextField
}

const { fieldComponent } = getFormHookHelpers();

export const { useAppForm } = createFormHook({
  fieldComponents: { TextField: fieldComponent.strict(TextInput, "field") },
  formComponents: {},
});
```

Benutzt wird sie danach wie bei uns, ohne `field`-Property: Das füllt die Bibliothek aus dem Feld, in dem die Komponente steht. Der Unterschied liegt im Typ. `fieldComponent.strict` merkt sich, welchen Werttyp die Komponente verlangt, und ein `TextField` an einem Zahlenfeld ist jetzt ein Compilerfehler. Genau die Lücke, über die wir gestolpert sind.

## Das Formular aufteilen: `withForm` fällt weg

Beim Aufteilen war das Problem der Typ des `form`-Objekts, und `withForm` war die Antwort darauf. In Version 2 gibt es dafür einen Typ, und die Feldgruppe ist wieder eine gewöhnliche Komponente:

```tsx
import { formOptions, type ReactFormType } from "@tanstack/react-form";

export const plantFormOptions = formOptions({ defaultValues });

type PlantFormApi = ReactFormType<typeof plantFormOptions>;

export function StammdatenFields({ form }: { form: PlantFormApi }) {
  return <fieldset>{/* ... */}</fieldset>;
}
```

Kein `render`-Property mehr, kein umschließender Aufruf: eine Funktion, ein Property, ein Typ dafür. `formOptions` bleibt und behält seine Aufgabe, denn aus ihm leitet sich `PlantFormApi` ab.

Die wiederverwendbare Variante, in Version 1 `withFieldGroup`, heißt in Version 2 `defineFieldGroup` und arbeitet mit derselben Idee wie vorher: Die Gruppe bringt ihre eigenen Feldnamen mit, und beim Einsetzen bildet man sie auf die Felder des großen Formulars ab.

## `form.Subscribe` vergleicht flach

In der Übung zu `form.Subscribe` haben wir ausprobiert, was passiert, wenn der Selektor ein Objekt zurückgibt: Es rendert bei jedem Tastendruck, weil der Vergleich mit `===` läuft und ein Objekt-Literal nie gleich dem vorherigen ist.

In Version 2 vergleicht `Subscribe` flach. Der Selektor darf also ein Objekt oder ein Array aus einfachen Werten zurückgeben, ohne dass es zusätzliche Renderdurchläufe kostet:

```tsx
<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
  {([canSubmit, isSubmitting]) => (
    <button type={"submit"} disabled={!canSubmit || isSubmitting}>
      Speichern
    </button>
  )}
</form.Subscribe>
```

Die Regel dahinter verschwindet damit nicht, sie verschiebt sich nur eine Ebene tiefer: Verschachtelte Objekte sind weiterhin bei jedem Aufruf neu und werden weiterhin als Änderung gewertet. Und für die Selektoren im Store gilt unverändert, was wir dort gelernt haben.

## Zwei Dinge, die neu dazukommen

**Listen von Feldern.** Für ein Feld, das eine Liste hält und je Eintrag wieder Felder rendert, gibt es `form.ArrayField` mit Hilfsfunktionen zum Anhängen, Entfernen und Umsortieren. In Version 1 baut man das von Hand.

**Server-Fehler im Formular.** Lehnt der Server eine Eingabe fachlich ab, muss man die Meldung in Version 1 selbst irgendwo unterbringen, meist als eigener Zustand über dem Formular. In Version 2 kann sie ins Formular zurück: `onSubmit` bekommt `createValidationError` und `parseIssues` herein, und was `onSubmit` zurückgibt, landet in der Fehlerliste des Formulars, bei passendem Pfad sogar am einzelnen Feld.

## Was bleibt

Der Aufbau ist derselbe, und das ist die eigentliche Nachricht dieses Abschnitts:

- `useForm` mit `defaultValues` und `onSubmit`, und der Typ kommt aus den Startwerten
- `form.Field` mit einer Funktion zwischen den Tags, die das Feld bekommt
- Kein Adapter für zod, denn der Vertrag heißt weiterhin Standard Schema
- Ein Feld wird von Hand an `value`, `onChange` und `onBlur` gebunden
- `form.Subscribe` mit einem Selektor, `createFormHook` für eigene Feld-Komponenten, `formOptions` für geteilte Optionen
- `handleSubmit`, `form.reset` und `form.state`

Was sich ändert, sind Schreibweisen und zwei Stellen, an denen die Bibliothek eine Schwäche behebt, die wir selbst gesehen haben: der ungeprüfte Werttyp an der Feld-Komponente und die Vermischung von Prüfen und Anzeigen.

## Material

- TanStack Form: <https://tanstack.com/form/latest>
- Das Repository, dort entsteht Version 2: <https://github.com/TanStack/form>
- Die Versionsliste auf npm, dort steht der aktuelle `alpha`-Stand:
  <https://www.npmjs.com/package/@tanstack/react-form?activeTab=versions>
- Standard Schema, der Vertrag zwischen zod und TanStack Form:
  <https://standardschema.dev>
