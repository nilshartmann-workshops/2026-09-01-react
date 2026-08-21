# Nebenbei: die Feldbindung abkürzen

Keine Übung, ein Angebot zum Weiterlesen. Es gehört zu `40_form_basics.md` und ändert nichts an dem, was wir dort bauen.

## Das Problem

TanStack Form bindet den Wert nicht selbst ans Feld. An jedem `<input>` und jedem `<select>` stehen deshalb dieselben vier Zeilen:

```tsx
<input
  name={field.name}
  value={field.state.value}
  onBlur={field.handleBlur}
  onChange={(e) => field.handleChange(e.target.value)}
/>
```

Bei vier Feldern ist das viermal dasselbe. Bei zwanzig ist es zwanzigmal dieselbe Gelegenheit, `onBlur` zu vergessen.

## Ein Helfer, der die vier Zeilen zurückgibt

Eine kleine Funktion oben in der Datei genügt. Sie gibt genau die DOM-Properties zurück, die ins Element gespreadet werden:

```tsx
function fieldProps(field: {
  name: string;
  state: { value: string | undefined };
  handleBlur: () => void;
  handleChange: (value: string) => void;
}) {
  return {
    name: field.name,
    value: field.state.value ?? "",
    onBlur: field.handleBlur,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      field.handleChange(e.target.value),
  };
}
```

Danach liest sich jedes Feld so:

```tsx
<form.Field name={"name"}>
  {(field) => (
    <div className={"FormControl"}>
      <label>Name der Pflanze</label>
      <input {...fieldProps(field)} />
    </div>
  )}
</form.Field>
```

Der Parameter braucht keinen Typ aus der Bibliothek. Beschreib einfach strukturell, was du benutzt (`name`, `state.value`, `handleBlur`, `handleChange`), dann prüft TypeScript, dass ein `field` dazu passt.

Sobald das Formular eine Validierung hat, nimmt man die Fehlerklasse gleich mit auf, und alle Felder bekommen sie auf einen Schlag:

```tsx
className: field.state.meta.errors.length > 0 ? "error" : undefined,
```

## Was der Helfer nicht kann

- **Er passt nur auf DOM-Elemente.** Der `IntervalSelector` ist keins: Er nimmt
  `interval` und `onIntervalChange` entgegen und geht deshalb weiterhin von
  Hand.
- **Er passt nur auf Felder mit String-Wert.** Ein Zahlenfeld oder eine
  Checkbox braucht eine eigene Variante, weil `e.target.value` etwas anderes
  liefert.
- **Er verdeckt Sonderfälle.** Unser Datumsfeld braucht ein eigenes `onChange`
  (ein geleertes `input type="date"` liefert `""`, nicht `undefined`). Das
  Feld überschreibt den Helfer dann wieder, und wer die Reihenfolge im Spread
  vertauscht, sucht den Fehler eine Weile.

## Warum wir ihn im Workshop nicht benutzen

Der Helfer ist eine Geschmacksfrage und lenkt vom Thema ab: In den Übungen soll an jedem Feld sichtbar bleiben, was TanStack Form eigentlich verlangt. Ausgeschrieben sieht man es, hinter `{...fieldProps(field)}` nicht mehr.

In einem echten Projekt lohnt sich der Helfer trotzdem, und ab dem zweiten oder dritten Formular lohnt sich der Schritt danach: eigene Feld-Komponenten mit `createFormHook`. Die schauen wir uns später an.
