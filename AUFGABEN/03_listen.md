# Listen rendern

## Dateien

- `src/types.ts` (anlegen!)
- `src/components/PlantCardList.tsx` (anlegen!)
- `src/components/App.tsx`

## Aufgabe

Baue eine neue Komponente, die eine **Liste** von `PlantCard`-Komponenten
darstellt. Die Daten dafür liegen als Array in der `App`-Komponente.

## Schritte

1. Lege die Datei `src/types.ts` an und definiere darin einen fachlichen
   TypeScript-Typ für die Pflanzen unserer Anwendung.
   - Diesen Typ werden wir später auch an anderen Stellen verwenden.
   - Es ist übliche Praxis, fachliche Typen in eine oder mehrere eigene Dateien
     zu legen.
   - Definiere und exportiere den Typ `Plant`. Er bekommt dieselben Properties
     wie schon unsere `PlantCard`, zusätzlich aber noch ein `id`-Feld:
     - `id` (String)
     - `name` (String)
     - `location` (String)
     - `wateringInterval` (Zahl)
     - `lastWatered` (String, optional)
   - 💬 Achte darauf: Diesen Typ schreiben und pflegen wir **von Hand**. Wenn sich die Daten später ändern, müssen wir daran denken, ihn anzupassen. Der Compiler kann uns hier nicht helfen. Später im Workshop werden wir genau diesen Typ wieder loswerden und uns stattdessen generieren lassen.
2. Lege die Datei `src/components/PlantCardList.tsx` an und darin die neue
   Komponente `PlantCardList`.
   - Die Komponente soll eine Liste (Array) des `Plant`-Typs als Property
     entgegennehmen.
   - Sie soll ein `div` mit der CSS-Klasse `PlantCardList` zurückliefern.
   - Innerhalb des `div`-Elements sollen die übergebenen Pflanzen jeweils mit
     der `PlantCard`-Komponente gerendert werden.
     - Verwende dazu die `map`-Funktion von JavaScript.
     - Denk an das `key`-Property von React!
3. Stell die `App`-Komponente um.
   - Erzeuge dort eine Liste (Array) von `Plant`-Objekten mit Beispieldaten. Leg das Array **außerhalb** der Komponentenfunktion an, denn es ändert sich nicht und muss deshalb nicht bei jedem Rendern neu erzeugt werden.
   - Render statt der einzelnen `PlantCard`-Komponenten nun die
     `PlantCardList`-Komponente.
     - Die bisherigen `PlantCard`-Aufrufe kannst du auskommentieren, dann kannst
       du später nachlesen, wie es vorher aussah.
   - Öffne die Browser-Konsole und stelle sicher, dass dort keine Fehler oder
     Warnungen ausgegeben werden.
4. 🧐 Zum Nachdenken: Statt der `id` könntest du auch den Index aus `map` als `key` verwenden (`plants.map((p, index) => <PlantCard key={index} ... />)`). Das funktioniert auf den ersten Blick genauso gut. Was könnte daran trotzdem problematisch sein, wenn sich die Liste später ändert (eine Pflanze wird vorne eingefügt oder gelöscht)?
   - Wenn du eine Vermutung hast, lies den Abschnitt „Hintergrund" ganz unten.

## Material

- Listen rendern in React: https://react.dev/learn/rendering-lists
  - `key`-Property:
    https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key
- JavaScript `map` auf einem Array:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
- TypeScript Arrays:
  https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays
- Wie React Listen abgleicht und Zustand dabei erhält:
  https://react.dev/learn/preserving-and-resetting-state

## Hintergrund: Warum der Index als `key` keine gute Idee ist

Der `key` ist für React kein Deko-Attribut, sondern die Antwort auf die Frage:
_„Ist dieses Listenelement dasselbe wie beim letzten Mal?"_ Beim Rendern
vergleicht React die alte Liste mit der neuen und ordnet die Elemente über ihre
`key`s einander zu.

Mit `key={p.id}` bleibt diese Zuordnung stabil. Fügst du vorne eine Pflanze ein,
erkennt React, dass alle bisherigen Karten noch da sind, und baut genau **eine**
neue davor. Die übrigen lässt es unangetastet.

Mit `key={index}` verschiebt sich die Zuordnung: Was vorher `key={0}` war, ist jetzt `key={1}`. Für React sieht das so aus, als hätte sich der **Inhalt jeder einzelnen Karte** geändert. Es schreibt alle um und hängt hinten eine an.

Solange die Karten nur Text anzeigen, merkst du davon nichts außer etwas
unnötiger Arbeit. Unangenehm wird es, sobald ein Listenelement **eigenen
Zustand** hat: ein Eingabefeld, ein aufgeklappter Bereich, eine Markierung.
Dieser Zustand hängt am `key`, also an der Position, und wandert beim Einfügen an die falsche Pflanze.

Faustregel: **Ein `key` ist eine fachliche Identität, keine Position.** Nimm die
`id` aus den Daten. Der Index ist nur dann unbedenklich, wenn die Liste sich
garantiert nie umsortiert und nichts eingefügt oder gelöscht wird.
