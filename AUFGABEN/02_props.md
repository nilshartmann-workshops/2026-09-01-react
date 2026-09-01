# Properties von Komponenten und dynamische Inhalte

## Dateien

- `src/components/PlantCard.tsx`
- `src/components/App.tsx`

## Aufgabe

Unsere `PlantCard`-Komponente soll per Properties ("Props") konfigurierbar sein:
Die anzuzeigenden Werte kommen nicht mehr fest verdrahtet aus der Komponente,
sondern von außen. Damit unterscheidet sich die Darstellung je nach den
übergebenen Werten.

## Schritte

1. Definiere einen TypeScript-Typ für die Properties deiner Komponente.
   - Die Komponente soll folgende Properties entgegennehmen:
     - `name` (String)
     - `location` (String)
     - `wateringInterval` (Zahl)
     - `lastWatered` (String, **optional**)
2. Passe die Signatur der Funktion deiner `PlantCard`-Komponente an und nimm die
   Properties dort entgegen.
   - Du kannst sie als `props`-Objekt verwenden oder gleich in der Signatur per
     Objekt-Destrukturierung auseinandernehmen.
   - Eine Komponente bekommt immer **genau ein** Argument: das Props-Objekt.
3. Tausche die statischen Informationen in der Komponente gegen die Werte aus
   den Properties aus.
   - JavaScript-Ausdrücke schreibst du in JSX in geschweifte Klammern:
     `<h2>{name}</h2>`.
4. Passe die Verwendung der Komponente in `App` an und übergib dort die
   Properties an deine `PlantCard`.
   - Strings kannst du direkt schreiben (`name="Aloe Vera"`), für Zahlen
     brauchst du geschweifte Klammern (`wateringInterval={12}`).
5. Mach ein paar Experimente:
   - Kannst du die Ausgabe, wie häufig gewässert werden muss, so anpassen, dass
     sie die korrekte Mehrzahl anzeigt? ("Jeden Tag gießen!" bzw. "Alle X Tage
     gießen")
   - `lastWatered` ist optional. Was soll die Komponente anzeigen, wenn kein Datum übergeben wird? Render die Zeile am besten gar nicht.
   - Zum Ausprobieren kannst du in `App` mehrere `PlantCard`-Komponenten mit
     unterschiedlichen Properties rendern.
6. 🧐 Optional (wenn du noch Zeit hast): Kannst du eine Warnung ausgeben, wenn
   die Wässerung überfällig ist?
   - In `src/components/date-utils.ts` findest du die Funktion
     `getDaysUntilWatering(lastWatered, wateringInterval)`. Damit kannst du
     ausrechnen, in wie vielen Tagen die nächste Wässerung ansteht bzw. wie
     lange sie schon überfällig ist (dann ist das Ergebnis negativ).
   - Das Datumsformat für `lastWatered` muss dafür `YYYY-MM-DD` sein, z.B.
     `2026-08-28`.
   - Für eine "rote" Meldung kannst du die CSS-Klasse `error-message` setzen.
   - Achtung: Die Funktion braucht ein `lastWatered`, und TypeScript wird dich darauf hinweisen, dass der Wert `undefined` sein kann.
   - Hinweis: Diesen optionalen Teil bauen wir nicht gemeinsam, er steht deshalb auch **nicht in der Musterlösung**. Wundere dich also nicht, wenn du sie im Lösungs-Commit nicht wiederfindest, deine Version ist trotzdem richtig.

## Material

- React
  - Properties an Komponenten übergeben:
    https://react.dev/learn/passing-props-to-a-component
  - JavaScript in JSX: https://react.dev/learn/javascript-in-jsx-with-curly-braces
  - Bedingtes Rendern mit JSX:
    https://react.dev/learn/conditional-rendering#conditionally-including-jsx
  - Ein einziges Wurzelelement:
    https://react.dev/learn/writing-markup-with-jsx#1-return-a-single-root-element
    - Fragment-Komponente: https://react.dev/reference/react/Fragment
- JavaScript / TypeScript
  - TypeScript Object Type (für das Properties-Objekt):
    https://www.typescriptlang.org/docs/handbook/2/objects.html
    - Alternativ kannst du auch ein `interface` verwenden:
      https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces
  - Destructuring:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring
  - Destructuring von Objekten und Funktionsargumenten (Slides aus meinem
    JS/TS-Workshop, Navigation mit Pfeiltaste rechts):
    https://nilshartmann-workshops.github.io/2025-06-13-js-ts-intro/js-grundlagen.html#/js-destructuring
  - Template Literals:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
