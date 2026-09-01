# State (Zustand) von Komponenten

## Dateien

- `src/components/IntervalSelector.tsx` (anlegen!)
- `src/components/App.tsx`

## Aufgabe

Baue eine neue Komponente, mit der man ein Intervall (in Tagen) auswählen kann. Die Komponente merkt sich den ausgewählten Wert selbst, in ihrem eigenen **State**.

## Schritte

1. Lege die neue Komponente `IntervalSelector` in der Datei
   `src/components/IntervalSelector.tsx` an.
2. Erzeuge mit `useState` einen State in der Komponente (TypeScript-Typ
   `number`), der initial auf `1` gesetzt ist.
   - `useState` gibt dir ein Array mit zwei Elementen zurück: den aktuellen Wert
     und eine Funktion zum Ändern. Üblicherweise nimmt man die beiden per
     Destrukturierung entgegen: `const [interval, setInterval] = useState(1);`
   - Wichtig: Den Wert **nie** direkt zuweisen (`interval = 5`), sonst rendert React nicht neu. Immer die Setter-Funktion benutzen.
3. Render ein Eingabefeld für Zahlen (`input` mit `type="number"`) und verknüpfe
   es mit dem State.
   - Der State ist der `value` des Eingabefelds, und im `onChange`-Handler
     setzt du den State auf den neuen Wert.
   - **Achtung!** Der Wert (`value`) im `onChange`-Ereignis ist immer ein
     `string`. Du musst ihn also vor dem Setzen in den State in eine `number`
     konvertieren.
   - Zeig ein Label an (z.B. "Gießintervall").
   - Pack Label und Eingabefeld zusammen in ein
     `<div className="FormControl">`. Das ist die CSS-Klasse, die wir im ganzen
     Workshop für ein Formularfeld benutzen.
   - Bau **kein** `form`-Element in den `IntervalSelector` hinein, auch wenn es naheliegt: Die Komponente wird später Teil eines echten Formulars, und ein `form` innerhalb eines `form` ist ungültiges HTML. React beschwert sich darüber dann auf der Konsole, nur eben in einer ganz anderen Übung, und dann sucht man lange.
4. Render den `IntervalSelector` in der `App`-Komponente.
   - Die bisherigen Komponenten kannst du auskommentieren. Wir stecken das später alles "richtig" zusammen. Im Moment ist die `App`-Komponente noch Spielwiese zum Ausprobieren.
5. Bau den `IntervalSelector` weiter aus:
   - Zeig den gewählten Wert an ("Alle X Tage gießen").
   - Füge Buttons hinzu, mit denen man gängige Intervalle per Klick setzen kann
     ("Täglich", "Wöchentlich", "Alle zwei Wochen").
   - Hinweis: Gib den Buttons `type="button"`. Ohne die Angabe sind sie für den Browser Absende-Buttons. Sobald so ein Button in einem `form` steht, schickt ein Klick das Formular ab und die Seite lädt neu, und bei uns steht er später in einem `form`.
6. 🧐 Optional (wenn du noch Zeit hast): Kannst du in der `App`-Komponente einen
   Button einbauen, mit dem du den `IntervalSelector` ein- und ausblenden
   kannst?
   - Dafür brauchst du auch einen State...
   - Was passiert mit dem Wert, den du im `IntervalSelector` ausgewählt hast,
     wenn du die Komponente ausblendest und wieder einblendest? Warum?

## Material

- React
  - React State: https://react.dev/learn/state-a-components-memory
    - insbesondere:
      https://react.dev/learn/state-a-components-memory#adding-a-state-variable
  - `useState`: https://react.dev/reference/react/useState
  - Event-Handler:
    https://react.dev/learn/responding-to-events#adding-event-handlers
  - Properties von HTML-Elementen (built-in browser components):
    https://react.dev/reference/react-dom/components/common
  - Typ für das Change-Event: `ChangeEvent<HTMLInputElement>` (aus `"react"`
    importieren)
    - `const handleEvent = (e: ChangeEvent<HTMLInputElement>) => { /* ... */ }`
- JavaScript
  - String in Zahl konvertieren mit dem `Number`-Konstruktor:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/Number
    - oder mit `parseInt`:
      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
  - Arrow-Funktionen:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
  - Arrow-Funktionen (Slides aus meinem JS/TS-Workshop):
    https://nilshartmann-workshops.github.io/2025-06-13-js-ts-intro/js-grundlagen.html#/arrow-functions

## Hintergrund: die spitzen Klammern bei `useState`

Man kann `useState` auch mit spitzen Klammern schreiben: `useState<number>(1)`. Das ist ein **Generic**, dieselbe Schreibweise wie `Array<Plant>` statt `Plant[]`: Ein Typ (hier `useState`) bekommt einen anderen Typ als "Parameter" mit.

Meistens kannst du die spitzen Klammern **weglassen**, weil TypeScript den Typ
aus dem Startwert ableitet: Bei `useState(1)` ist klar, dass es sich um eine
`number` handelt. Deshalb steht in unserer Lösung auch keine.

Gebraucht werden sie, wenn der Startwert nichts hergibt, zum Beispiel bei `useState<Plant | undefined>(undefined)`. Ohne die Angabe wüsste TypeScript nur, dass der State `undefined` ist, und würde sich beschweren, sobald du eine `Plant` hineinsetzt. Genau diesen Fall siehst du in der nächsten Übung wieder.
