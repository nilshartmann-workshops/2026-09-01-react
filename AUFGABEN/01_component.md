# Übung: Eine React-Komponente

## Dateien

- `src/components/PlantCard.tsx` (anlegen!)
- `src/components/App.tsx`

## Vorbereitung

- Stell sicher, dass der Vite Development Server läuft.
  - Dazu im `workspace`-Verzeichnis das `dev`-Script aus der `package.json`
    ausführen: `npm run dev`
  - Der Server läuft dann auf Port 3000.
- **Hinweis:** Wenn der Server läuft und du eine Datei speicherst, sollte sich
  die Anzeige im Browser automatisch aktualisieren.
  - Falls das nicht funktioniert, lade die Seite im Browser neu.
  - Neu starten musst du den Server normalerweise nicht.
- Öffne die Datei `eslint.config.js` und setze darin die Konstante
  `enableImportRules` auf `false`.
  - Damit ist die Regel abgeschaltet, die deine `import`-Statements sortiert
    haben will. Im "echten Leben" kann man das anlassen, beim Live-Coding im
    Workshop ist es nur lästig.

## Aufgabe

Baue deine erste React-Komponente: die Basis-Version unserer `PlantCard`-Komponente. Sie zeigt eine Pflanze mit fest verdrahteten Werten an, Daten von außen kommen erst in der nächsten Übung dazu.

## Schritte

1. Erstelle die neue Datei `src/components/PlantCard.tsx`.
   - Dateien mit TypeScript- **und** JSX-Code **müssen** auf `.tsx` enden.
   - Dateien mit reinem TypeScript-Code (ohne JSX) dürfen auch `.ts` heißen.
2. Implementiere die `PlantCard`-Komponente.
   - Um es einfach zu halten, starten wir mit Folgendem: einem äußeren
     `div`-Element mit der CSS-Klasse `PlantCard`, das zwei Kinder enthält:
     1. ein `header` mit dem Pflanzennamen (Element `h2`) und dem Standort
        (Element `div`)
     2. eine `section` mit Gießintervall und Datum der letzten Wässerung
        (jeweils ein `div`)
   - Achtung: Eine Komponente muss **genau ein** Wurzelelement zurückgeben, deshalb das äußere `div`.
   - Der Name einer Komponente muss **großgeschrieben** sein. React erkennt
     daran, dass `<PlantCard />` deine Komponente meint und nicht ein
     HTML-Element.
   - Styling steht in diesem Workshop nicht im Fokus, aber wenn du magst, kannst
     du eigenes CSS ergänzen (siehe unten).
   - Vergiss nicht, die Komponente zu exportieren.
3. Binde die Komponente in die `App`-Komponente ein.
   - Die `App`-Komponente ist die Wurzelkomponente unserer Anwendung, die
     gerendert wird, wenn die Anwendung startet.
   - Sie dient uns erstmal als "Spielwiese" zum Ausprobieren unserer
     Komponenten. Später bauen wir daraus die richtige Anwendung.
   - Die `App`-Komponente gibt derzeit `Hello React` aus. Entferne das
     `h1`-Element und render stattdessen deine `PlantCard`.

## Material

- React-Komponenten: https://react.dev/learn/your-first-component
- CSS-Klassennamen in React: https://react.dev/learn#adding-styles
- Importieren und Exportieren von Komponenten:
  https://react.dev/learn/importing-and-exporting-components
  - Hinweis: In unserer Umgebung musst du die Dateiendung beim Import nicht
    angeben, z.B. `import PlantCard from "./PlantCard"`.

## Hintergrund: CSS in React

- Tailwind ist im Arbeitsbereich installiert und kann sofort verwendet werden.
  - Wenn du kein Tailwind verwenden willst, kannst du alles in `src/index.css`
    löschen und darin eigene CSS-Klassen schreiben.
  - Alternativ kannst du dein eigenes CSS in einzelne Dateien aufteilen: Lege
    dafür eine oder mehrere `.css`-Dateien an und importiere sie in deine
    Komponenten, z.B. `import "./PlantCard.css";`.
- Egal, ob du Tailwind oder eigenes CSS verwendest: Statt `class` musst du in
  React das Attribut `className` verwenden, um CSS-Klassen zu setzen
  (https://react.dev/learn#adding-styles).
- Für Inline-Styles (`style`-Property) musst du in React ein Objekt übergeben,
  siehe
  https://react.dev/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx
