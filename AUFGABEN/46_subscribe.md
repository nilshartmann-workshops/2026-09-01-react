# Auf Formularwerte reagieren mit form.Subscribe

## Dateien

- `src/components/PlantForm.tsx`
- `src/components/date-utils.ts` (nur benutzen)

## Aufgabe

Unter dem Gießzeitraum soll live stehen, wann das nächste Mal gegossen werden muss, berechnet aus `lastWatered` und `wateringInterval`, während man tippt. Dafür lernst du `form.Subscribe` kennen, und nebenbei die Frage, die dabei am häufigsten schiefgeht: **Was darf ein Selektor zurückgeben?**

## Der erste Versuch, der nicht funktioniert

Naheliegend wäre, die Werte einfach in der Komponente zu lesen:

```tsx
const days = getDaysUntilWatering(
  form.state.values.lastWatered,
  form.state.values.wateringInterval,
);
```

Probier das ruhig aus. Die Zahl steht da, aber sie **ändert sich nicht mit**, wenn du im Formular tippst.

Der Grund ist derselbe, aus dem das Formular so schnell ist: `useAppForm` abonniert den Formularzustand gar nicht. Neu gerendert wird nur, was sich angemeldet hat, und bisher waren das die Felder, jedes für sich. `PlantForm` selbst rendert nach dem ersten Mal nicht mehr, und `form.state` liefert deshalb den Stand von damals.

## Schritte

1. Schreib die Anzeige als eigene Komponente, außerhalb von `PlantForm`:

   ```tsx
   function NextWateringHint({ days }: { days: number | undefined }) {
     if (days === undefined) {
       return null;
     }

     if (days < 0) {
       return <p className={"error-message"}>Überfällig seit {-days} Tagen 🥀</p>;
     }

     if (days === 0) {
       return <p>Heute gießen 💧</p>;
     }

     return <p>Nächstes Gießen in {days} Tagen</p>;
   }
   ```

   - `getDaysUntilWatering(lastWatered, wateringInterval)` steht schon in
     `src/components/date-utils.ts`. Sie gibt die Tage bis zum nächsten Gießen
     zurück; ist der Termin vorbei, ist das Ergebnis negativ.
2. Häng sie unter das Datumsfeld, in ein `form.Subscribe`:

   ```tsx
   <form.Subscribe
     selector={(state) =>
       state.values.lastWatered
         ? getDaysUntilWatering(
             state.values.lastWatered,
             state.values.wateringInterval,
           )
         : undefined
     }
   >
     {(days) => <NextWateringHint days={days} />}
   </form.Subscribe>
   ```

   - Zwischen den Tags steht wieder eine **Funktion**, dieselbe Bauform wie bei
     `form.Field`. Sie bekommt das, was der Selektor ausgerechnet hat.
   - Ohne `lastWatered` lässt sich nichts ausrechnen, deshalb `undefined`.
3. Probier es aus: Wähl ein Datum, stell das Intervall um, klick auf die
   Schnellwahl-Buttons. Die Zeile darunter rechnet mit.
4. **Und jetzt die Stelle, um die es hier eigentlich geht.** Bau den Selektor
   probeweise so um, dass er beide Werte als Objekt zurückgibt und die
   Rechnung erst in der Funktion darunter passiert:

   ```tsx
   selector={(state) => ({
     lastWatered: state.values.lastWatered,
     wateringInterval: state.values.wateringInterval,
   })}
   ```

   Häng ein `console.log("Hinweis rendert")` in `NextWateringHint` und tipp
   dann im **Namensfeld**.
   - Vorher: nichts passiert, der Name geht die Rechnung nichts an.
   - Jetzt: bei jedem Tastendruck eine Zeile.
   - Warum? `Subscribe` ruft den Selektor nach jeder Änderung auf und vergleicht das Ergebnis mit dem vorherigen, **und zwar mit `===`**. Ein Objekt-Literal ist bei jedem Aufruf ein neues Objekt und damit nie `===`. Dieselbe Referenz-Identität wie beim Dependency-Array eines Effekts und bei den Selektoren im Store.
   - Mach es wieder rückgängig: **Ein Selektor gibt einen einfachen Wert zurück**, also eine Zahl, einen String, einen Boolean. Braucht man mehrere, rechnet man sie im Selektor zu einem Wert zusammen oder nimmt zwei `Subscribe`.
   - Den `console.log` danach wieder rausnehmen.

## Material

- `form.Subscribe`:
  <https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts#reactivity>
- Der Formularzustand, den der Selektor bekommt:
  <https://tanstack.com/form/latest/docs/framework/react/reference/type-aliases/reactformextendedapi>
- `useStore` als Hook-Variante von `Subscribe`:
  <https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts#usestore>
