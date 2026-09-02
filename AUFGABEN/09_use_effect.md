# Seiteneffekte mit useEffect

## Dateien

- `src/spielwiese/EffektSpielwiese.tsx` (legst du neu an)
- `src/spielwiese/Counter.tsx` (das Gerüst liegt schon da, der Effekt fehlt)
- `src/components/App.tsx` (bekommt einen Tab dazu)
- `src/spielwiese/RenderSpielwiese.tsx` (nur für den optionalen Teil ganz am Ende)

## Vorbereitung

Öffne die Browser-Konsole und lass sie geöffnet. Ohne sie siehst du die Hälfte dieser Übung nicht.

## Aufgabe

Der `Counter` soll sich mit etwas außerhalb von React synchronisieren: mit dem Titel des Browser-Tabs. Die Komponente selbst ist fertig (zwei States, zwei Buttons, die Anzeige). Du gibst ihr einen eigenen Tab in der Anwendung und baust den Effekt hinein. Dabei lernst du seine drei Teile kennen: den Effekt selbst, das Dependency-Array und die Aufräum-Funktion.

Im zweiten Teil geht es um die Frage, wann React eine Dependency überhaupt für
"geändert" hält. Das ist der Punkt, an dem Effekte in echten Projekten am
häufigsten aus dem Ruder laufen.

## Teil 1: Effekt, Cleanup, Dependency-Array

1. Für `Counter` in die TabBar in App ein.
2. Mach `src/spielwiese/Counter.tsx` auf und sieh dir an, was da ist: die States
   `appleCount` und `orangeCount`, je ein Button dazu, und ein `todo` an der
   Stelle, an der der Effekt hin soll.
3. Schreib an dieser Stelle einen Effekt, der den Titel des Browser-Tabs setzt.
   - `useEffect(() => { ... }, [appleCount])`
   - Im Effekt: `window.document.title = \`${appleCount} Äpfel\`;`
   - Schreib zusätzlich eine Zeile auf die Konsole, damit du siehst, **wann**
     der Effekt läuft.
   - Der Tab-Titel steht ganz oben im Browser-Fenster. Je nach Browser musst du den Tab schmal machen oder mit der Maus darüberfahren, um ihn ganz zu sehen.
4. Ergänze eine **Aufräum-Funktion** (cleanup): Der Effekt gibt eine Funktion
   zurück, die den ursprünglichen Titel wiederherstellt.
   - Den ursprünglichen Titel merkst du dir am Anfang des Effekts in einer
     lokalen Variablen.
   - Schreib auch hier etwas auf die Konsole.
5. Jetzt beobachte auf der Konsole und im Tab-Titel:
   - Du klickst auf "Ein Apfel mehr": Läuft der Effekt? Läuft das Cleanup?
   - Du klickst auf "Eine Orange mehr": Läuft der Effekt? Warum (nicht)?
   - Du blendest den `Counter` aus: Was passiert mit dem Tab-Titel?
6. Experimentiere mit dem Dependency-Array. Probier der Reihe nach:
   - `[appleCount]`, wie gehabt
   - `[]` (leeres Array): Der Effekt läuft nur einmal, wenn die Komponente erscheint. Was steht dann dauerhaft im Tab-Titel?
   - **gar kein** Array: Der Effekt läuft nach **jedem** Render, also auch bei den Orangen. Achtung: Hier kann man sich leicht eine Endlosschleife bauen, wenn der Effekt selbst einen State setzt.

## Teil 2: Wann ist eine Dependency "geändert"?

**NICHT MACHEN!!!!!!**

8. Bis hierhin stand im Dependency-Array eine Zahl. Jetzt kommt etwas dazu, das
   in echtem Code ständig passiert: Der Titel soll den Singular richtig
   schreiben, also schreiben wir eine kleine Funktion dafür, und zwar
   **oberhalb** des Effekts, in der Komponente:

   ```tsx
   const formatTitle = () =>
     appleCount === 1 ? "1 Apfel" : `${appleCount} Äpfel`;

   useEffect(() => {
     // ...
     window.document.title = formatTitle();
     // ...
   }, [formatTitle]);
   ```

   - Warum steht `formatTitle` im Dependency-Array? Weil der Effekt sie benutzt. Lässt du sie weg, mahnt ESLint es an, und zwar als **Warnung**, nicht als Fehler: _"React Hook useEffect has a missing dependency: 'formatTitle'"_. Die Regel hat recht: Alles, was der Effekt von außen liest, gehört hinein.
   - Klick jetzt auf **"Eine Orange mehr"** und schau auf die Konsole.
9. Der Effekt läuft, obwohl sich an den Äpfeln nichts geändert hat, und tatsächlich läuft er bei **jedem** Render. Der Grund ist **Referenz-Identität**. Probier das in der Browser-Konsole aus:

   ```js
   (() => 1) === (() => 1); // false
   ({ a: 1 }) === ({ a: 1 }); // false
   [1, 2] === [1, 2]; // false
   "abc" === "abc"; // true
   ```

   In JavaScript ist jede neu erzeugte Funktion ein neuer Wert, und jedes neu erzeugte Objekt und Array ebenfalls, auch wenn inhaltlich dasselbe drinsteht. React vergleicht die Dependencies mit `===`. Bei jedem Render der Komponente entsteht `formatTitle` neu, also ist die Dependency jedes Mal "anders".
10. 🧐 Und jetzt stell dir vor, im Effekt steht nicht `document.title = …`,
    sondern ein `fetch`. Was passiert dann bei jedem Tastendruck in einem
    Formular? Und was passiert, wenn der Effekt selbst einen State setzt?
    - Genau deshalb ist das hier kein Schönheitsthema. Ein Rendern zu viel ist
      ärgerlich; ein Effekt, der zu oft läuft, ist ein Fehler.
11. Repariert wird das in dieser Reihenfolge, und die erste Möglichkeit, die funktioniert, ist die richtige:
    - **a) Die Funktion in den Effekt ziehen.** Dann ist sie keine Dependency mehr, sondern eine lokale Variable, und im Array bleibt `[appleCount]` stehen, also der Wert, um den es wirklich geht. Mach es so.
    - **b) Nur einfache Werte ins Array.** Statt eines ganzen Objekts das eine
      Feld, auf das es ankommt: `[plant.id]` statt `[plant]`. Strings und
      Zahlen vergleichen sich mit `===` so, wie man es erwartet.
    - **c) `useCallback`**, erst wenn a) und b) nicht gehen, etwa weil die
      Funktion von außen als Property hereinkommt:
      `const formatTitle = useCallback(() => …, [appleCount]);`
      Damit bleibt es dieselbe Funktion, solange sich `appleCount` nicht ändert.
      - Merkregel: **`useCallback` ist für Funktionen, `useMemo` für alles
        andere.** (`useCallback(fn, deps)` ist nichts anderes als
        `useMemo(() => fn, deps)`.)
12. 🧐 Optional (wenn du noch Zeit hast, 2 Minuten): Wechsel auf den Tab "Rendern (Spielwiese)" und tausch in `RenderSpielwiese.tsx` das erste Zeilenpaar: `useCallback` raus, die Zeile darunter rein.
    ```
    // const handleReset = useCallback(() => setCounter(0), []);
    const handleReset = () => setCounter(0);
    ```
    - Tipp ins Textfeld: Der Zähler des Memo-Kindes läuft jetzt mit. Dasselbe Prinzip, das eben den Effekt zu oft hat laufen lassen, macht hier `memo` wirkungslos, denn eine neue Funktion ist eine geänderte Property.
    - Dasselbe Spiel mit dem zweiten Zeilenpaar (`tags`), nur mit einem Array
      statt einer Funktion und `useMemo` statt `useCallback`.
    - Der Unterschied ist die Folge: Auf der Spielwiese rendert etwas unnötig.
      Im Effekt war es ein Fehler. Beide Male ist die Ursache dieselbe.
    - Mach die Zeilenpaare danach wieder wie vorher.

## Material

- `useEffect`: https://react.dev/reference/react/useEffect
- "You Might Not Need an Effect": https://react.dev/learn/you-might-not-need-an-effect
- Synchronisieren mit Effekten:
  https://react.dev/learn/synchronizing-with-effects
- **Dependencies loswerden** (der ganze Teil 2 in ausführlich):
  https://react.dev/learn/removing-effect-dependencies
- `useCallback`: https://react.dev/reference/react/useCallback
- `useMemo`: https://react.dev/reference/react/useMemo
  - insbesondere "Should you add useMemo everywhere?":
    https://react.dev/reference/react/useMemo#should-you-add-usememo-everywhere
- Gleichheit in JavaScript:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness
- `<StrictMode>`: https://react.dev/reference/react/StrictMode

## Hintergrund: `useCallback` ist die dritte Antwort, nicht die erste

Im Netz liest man das Rezept oft andersherum: "Effekt läuft zu oft? Pack die Funktion in `useCallback`." Das funktioniert, ist aber meistens das falsche Werkzeug, und es hat einen Nebeneffekt, den man erst später merkt.

`useCallback` steckt die Funktion nämlich nicht weg, es reicht das Problem nur
weiter: Jetzt braucht *sie* ein korrektes Dependency-Array, und wenn dort etwas
fehlt, arbeitet der Effekt irgendwann mit veralteten Werten. Aus einem
sichtbaren Fehler (läuft zu oft) ist ein unsichtbarer geworden (rechnet mit
alten Daten).

Deshalb die Reihenfolge aus Schritt 11: erst die Funktion **in** den Effekt ziehen, dann die Dependencies auf einfache Werte herunterbrechen, und erst danach memoisieren. Die React-Dokumentation widmet dem ein eigenes Kapitel ("Removing Effect Dependencies", siehe Material).

Nebenbei: Für Code, der im Effekt laufen, aber *kein* erneutes Synchronisieren auslösen soll (etwa eine Protokollzeile, die den aktuellen Benutzer mitschreibt), gibt es `useEffectEvent`. Was darin steht, liest immer die frischen Werte, taucht aber nicht im Dependency-Array auf. Wir benutzen es hier nicht; wenn dir der Name begegnet, weißt du jetzt, welches Problem er löst.

## Hintergrund: Effekte sind die letzte Wahl

Aus der React-Dokumentation:

> In React, **side effects usually belong inside event handlers**. [...] If
> you've exhausted all other options and can't find the right event handler for
> your side effect, you can still attach it to your returned JSX with a
> useEffect call in your component. [...] **However, this approach should be
> your last resort**.
>
> (https://react.dev/learn/keeping-components-pure#where-you-_can_-cause-side-effects)

Das gilt ausdrücklich auch fürs **Laden von Daten**. Man *kann* in einem Effekt `fetch` aufrufen, und lange hat man das auch gemacht. Dann muss man sich aber selbst um Ladezustand, Fehler, Caching und Race Conditions kümmern (zwei Requests unterwegs, der langsamere kommt zuletzt an und überschreibt das neuere Ergebnis). Deshalb nimmt man dafür heute eine Bibliothek. Wie das aussieht, sehen wir später.

## Hintergrund: der Strict Mode

In vielen React-Projekten ist die Wurzelkomponente in `<StrictMode>` eingepackt. Dann ruft React in der **Entwicklung** jeden Effekt absichtlich doppelt auf: erst den Effekt, dann sofort das Cleanup, dann den Effekt noch einmal. Das ist keine Fehlfunktion, sondern ein Test. Geht deine Komponente dabei kaputt, fehlt meistens eine saubere Aufräum-Funktion. In der Produktion passiert das nicht.

In unserem Projekt ist der Strict Mode **nicht** eingeschaltet, damit die Ausgaben auf der Konsole übersichtlich bleiben. Wenn du es sehen willst: Pack in `src/main.tsx` das `<App />` probeweise in `<StrictMode>` ein (Import aus `"react"`) und schau dir die Konsole an. Mach es danach wieder rückgängig, sonst zählen die Render-Zähler auf der Spielwiese doppelt.
