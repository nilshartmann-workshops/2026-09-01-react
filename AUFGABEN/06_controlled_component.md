# "Kontrollierte" Komponenten

## Dateien

- `src/components/IntervalSelector.tsx`
- `src/components/App.tsx`

## Aufgabe

Mach aus dem `IntervalSelector` eine _kontrollierte_ (controlled) Komponente:
Sie hat danach keinen eigenen State mehr, sondern bekommt den anzuzeigenden Wert
per Property von außen und meldet Änderungen per Callback-Funktion nach außen.

## Schritte

1. Erzeuge einen TypeScript-Typ für die Properties von `IntervalSelector`.
   - Als Props brauchst du:
     1. den aktuellen Wert, den der `IntervalSelector` anzeigen soll
     2. eine Callback-Funktion, die der `IntervalSelector` aufruft, wenn der
        Wert geändert wird
   - Eine Funktion als Property beschreibst du in TypeScript so:
     `onIntervalChange(newInterval: number): void;`
2. Entferne den State aus der Komponente und verschiebe ihn in die
   `App`-Komponente ("lifting state up").
   - Überall dort, wo bisher `setInterval(...)` stand, rufst du jetzt die
     Callback-Funktion aus den Props auf.
   - Pass in `App` den Aufruf der `IntervalSelector`-Komponente an: Dort hältst
     du jetzt den State und gibst ihn zusammen mit der Setter-Funktion hinein.
3. Erweitere die Schnittstelle der `IntervalSelector`-Komponente.
   - Der übergebene `interval` soll auch `undefined` sein dürfen, damit man das
     Eingabefeld nicht zwingend mit einem Wert vorbelegen muss.
   - Du kannst an ein `input`-Element als `value` leider **kein** `undefined`
     übergeben. Wenn dein Wert `undefined` ist, musst du stattdessen einen
     Leerstring übergeben.
   - **Achtung, zweite Stelle:** Der Wert steht nicht nur im `value` des Eingabefelds, sondern auch in der Anzeige "Alle X Tage gießen", die du vorhin gebaut hast. Ist `interval` jetzt `undefined`, steht dort wörtlich "Alle undefined Tage gießen", ohne Warnung, ohne Fehler, einfach falsch. Render die Zeile in dem Fall gar nicht.
   - Gib in `App` `undefined` als Startwert an (`useState<number>()`).
     - Öffne die Browser-Konsole.
     - Gib einen Wert in das Eingabefeld ein.
     - Es sollten **keine** Fehler oder Warnungen auf der Konsole zu sehen sein. (Wenn doch, steht dort vermutlich etwas über "uncontrolled to controlled", und dann ist irgendwo noch ein `undefined` als `value` unterwegs.)
4. Leg schon ein drittes, optionales Property `error?: boolean` an.
   - Ist es gesetzt, bekommt das `input` die CSS-Klasse `error` und wird rot.
   - Wir benutzen es erst später, wenn das Formular eine Validierung bekommt. Die Schnittstelle der Komponente ist damit aber fertig, und du kannst schon mal ausprobieren, wie das aussieht.
5. 🧐 Zum Nachdenken: Der `IntervalSelector` weiß jetzt nichts mehr über den Wert, den er anzeigt, er ist reine Darstellung. Was gewinnen wir dadurch? (Tipp: Wir werden dieselbe Komponente später in einem ganz anderen Zusammenhang wiederverwenden.)

## Material

- React
  - State zwischen Komponenten teilen:
    https://react.dev/learn/sharing-state-between-components
  - "Controlled and uncontrolled components":
    https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components
  - Explizite Typangaben für `useState`:
    https://react.dev/learn/typescript#typing-usestate
- TypeScript
  - Funktionssignaturen beschreiben:
    https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions
  - `null` und `undefined`:
    https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined

## Hintergrund: controlled vs. uncontrolled

Ein Eingabefeld ist **uncontrolled**, wenn der Browser den Wert verwaltet und man ihn erst dann ausliest, wenn man ihn braucht (zum Beispiel beim Absenden des Formulars). Es ist **controlled**, wenn React den Wert verwaltet: Der Wert kommt als `value` in das Feld hinein, und jede Änderung geht über `onChange` zurück in den State.

Dasselbe gilt für ganze Komponenten: Unser `IntervalSelector` war vorher
uncontrolled (eigener State, niemand von außen kommt an den Wert heran) und ist
jetzt controlled.
