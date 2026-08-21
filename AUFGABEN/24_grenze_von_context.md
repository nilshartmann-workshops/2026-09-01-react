# Die Grenze von Context

**Keine Übung**, das schauen wir uns gemeinsam an. Der kleinere Teil passiert im Code, der größere am Whiteboard.

## Dateien

- `src/components/TabBar.tsx` (es kommt nur ein Render-Zähler dazu)

## Vorbereitung

Öffne die Browser-Konsole und lass sie geöffnet. Die React Developer Tools ("Highlight updates when components render") sind hier ebenfalls nützlich.

## Worum es geht

Unsere `TabBar` benutzt Context, und sie tut es richtig. Trotzdem hört man über Context ständig, er sei "langsam" oder "kein State-Management". Beides stimmt so nicht, aber es steckt etwas dahinter.

Am Ende dieses Schrittes hast du eine Regel, mit der du in einem echten Projekt entscheiden kannst: Reicht Context hier, oder brauche ich etwas anderes?

## Teil 1: Was Context beim Rendern tut

1. 👀 **Das Messinstrument bauen wir gemeinsam**, es ist reines Werkzeug und
   kommt dir bekannt vor: ein `useRef` in `Tab`, das bei jedem Render hochgezählt und hinter der Beschriftung angezeigt wird, also derselbe Render-Zähler wie beim Kind auf der Spielwiese, samt dem `eslint-disable react-hooks/refs` drumherum.
2. Jetzt klicken wir uns durch die Tabs und schauen auf die Zähler. Sie zählen
   alle bei jedem Wechsel hoch.
   - Beim Tab, den wir verlassen, und bei dem, auf den wir gewechselt sind, ist
     das auch richtig so: Der eine wird `disabled`, der andere nicht mehr.
   - Aber sieh dir die Tabs an, die **weder vorher noch nachher** aktiv waren.
     Sie waren nicht `disabled` und sind es immer noch nicht. Ihre Funktion
     läuft erneut und produziert Zeichen für Zeichen dasselbe Ergebnis wie
     vorher.
3. Erster Reparaturversuch: Wir wickeln `Tab` in `memo()`. Seine Properties sind konstant, denn `tabId` ist ein String und `children` ein fester Text.
   - **Beobachtung:** Der Zähler läuft weiter, als wäre nichts gewesen. 🤨
   - **`memo` vergleicht Properties. Ein Context ist keine Property.** Wer einen Context konsumiert, wird von React direkt benachrichtigt, sobald dessen Wert sich ändert, und zwar an `memo` vorbei. Das ist keine Lücke, sondern Absicht: Sonst würde die Komponente veraltete Werte anzeigen.
   - `memo` kommt wieder raus.
4. Zweiter Reparaturversuch, die Zeile, die man im Netz am häufigsten findet:
   den Context-Wert in `useMemo` einpacken.
   ```tsx
   <TabBarContext value={useMemo(() => ({ activeTabId, onTabChange: setActiveTabId }), [activeTabId])}>
   ```
   - **Beobachtung:** Ändert auch nichts.
   - 🧐 Warum nicht? (Tipp: Was soll da eigentlich stabil gehalten werden?)
   - Auch das kommt wieder raus. Es ist die Sorte Optimierung, die man einbaut,
     ohne vorher zu messen: Der Code ist umständlicher geworden, das Verhalten
     ist unverändert.

## Teil 2: Die Regel (Whiteboard)

5. Halten wir fest, was wir gesehen haben: **Jeder Consumer eines Contexts rendert bei jeder Änderung des Context-Werts.** Nicht nur die, die den geänderten Teil benutzen, sondern alle. Und dagegen hilft weder `memo` noch `useMemo`.
6. Ist das schlimm? Das hängt von zwei Dingen ab, und daraus ergeben sich vier Felder:

   |  | **kleiner Consumer-Baum** | **großer Consumer-Baum** |
   |---|---|---|
   | **ändert sich selten** | unauffällig | Theme, Locale, angemeldeter Benutzer, also der klassische Context |
   | **ändert sich häufig** | unsere `TabBar`, ein Accordion, ein `Select` | hier kippt es |

   - Unsere `TabBar` steht links unten: Der Wert ändert sich bei jedem Klick, aber daran hängen nur ihre eigenen Tabs und Panels. Das ist genau das, wofür Context gemacht ist. Radix, Headless UI und jede andere Komponentenbibliothek bauen ihre zusammengesetzten Komponenten so.
   - Rechts oben ist der zweite klassische Fall: Ein Theme hängt über der
     ganzen Anwendung, ändert sich aber vielleicht einmal am Tag.
   - **Nur rechts unten wird es unangenehm**, also bei einem Wert, den halb die Anwendung liest und der sich ständig ändert.
7. 🧐 Und jetzt die Frage, mit der wir weitermachen: Wir wollen als Nächstes
   Favoriten einbauen. Eine Pflanze lässt sich zum Favoriten machen, eine
   zweite Liste zeigt nur die Favoriten, und vielleicht steht die Anzahl auch
   noch irgendwo oben in der Ecke.
   - In welchem der vier Felder landet dieser Zustand?
   - Was bräuchte man, damit **nur die eine Karte** neu rendert, deren
     Favoriten-Status sich geändert hat?

## Material

- Bevor du Context einsetzt (lesenswert):
  https://react.dev/learn/passing-data-deeply-with-context#before-you-use-context
- Context und Rendern:
  https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions
- `memo`: https://react.dev/reference/react/memo
- React DevTools Profiler:
  https://react.dev/learn/react-developer-tools

## Hintergrund: Wann `useMemo` am Context-Wert doch hilft

Der Versuch aus Schritt 4 war nicht dumm, er war nur am falschen Ort. Es gibt zwei verschiedene Situationen, und sie werden oft verwechselt:

- **Der Wert ändert sich wirklich.** Dann gibt es nichts zu stabilisieren, und
  `useMemo` ist nur zusätzlicher Code. Das ist unser Fall: `activeTabId` ist
  nach dem Klick ein anderer String als vorher.
- **Der Wert ändert sich logisch nicht, aber der Provider rendert trotzdem**,
  weil sein eigener Elternteil rendert. Dann entsteht durch das Objekt-Literal
  `value={{ … }}` bei jedem Render ein neues Objekt, React vergleicht
  Context-Werte mit `===`, und der ganze Consumer-Baum rendert umsonst mit.
  **Hier** verhindert `useMemo` das tatsächlich.

Der zweite Fall trifft vor allem die Contexts aus dem Feld rechts oben: die großen, weit oben aufgehängten. Anders gesagt: `useMemo` am Context-Wert lohnt sich ausgerechnet dort, wo Context richtig eingesetzt ist.

## Hintergrund: Die Auswege, und was sie taugen

| Weg | Bringt was? |
|---|---|
| Consumer mit `memo` isolieren | nichts, denn `memo` sieht den Context nicht |
| Context-Wert mit `useMemo` stabilisieren | nur, wenn der Wert sich gar nicht geändert hat |
| Context aufteilen (Zustand / Aktionen) | funktioniert, kostet aber zwei Provider, zwei Hooks, und jede Komponente muss wissen, an welchem Context sie hängt |
| Selektor-Funktionen (`nur den Teil, den ich brauche`) | mit purem Context nicht machbar, dafür braucht es eine Bibliothek |

Die dritte Zeile ist ein ehrliches Werkzeug, aber ein umständliches: Man verdoppelt die Zeremonie, um ein einzelnes Feld zu isolieren. Bei zwei Feldern geht das noch, bei acht nicht mehr.

Die vierte Zeile ist der Grund, warum es Bibliotheken für globalen Zustand gibt, und zugleich der nächste Schritt.
