# Die Anwendung zusammenbauen

## Dateien

- `src/components/PlantList.tsx` (anlegen!)
- `src/components/App.tsx`
- `src/components/TabBar.tsx` (nur lesen, hier ist nichts zu ändern)

## Aufgabe

Ab jetzt bauen wir keine Einzelteile mehr, sondern eine "Anwendung"": eine `TabBar` mit zwei Reitern, nämlich "Pflanzen" (zeigt die Pflanzenliste) und "Neue Pflanze" (zeigt das `PlantForm`). Die `TabBar` selbst ist schon fertig; deine Aufgabe ist es, sie in `App` zu verdrahten.

Dazu kommt eine neue Komponente `PlantList`. Sie ist die Komponente, die "die Pflanzen anzeigt", mehr braucht `App` über sie nicht zu wissen. Die Beispieldaten ziehen dafür aus `App` in die `PlantList` um.

**Das heißt auch: Der `IntervalSelector` verschwindet wieder aus `App`**, und mit ihm der State dafür und der Ein-/Ausblenden-Button aus dem optionalen Teil der letzten Übungen. Die drei waren nur zum Ausprobieren da, und im Tab-Layout ist kein Platz für sie. Die Datei `IntervalSelector.tsx` bleibt natürlich liegen: Später kommt die Komponente als Feld im richtigen Formular zurück.

## Schritte

1. Sieh dir zuerst `src/components/TabBar.tsx` an.
   - Die Datei enthält drei Komponenten: `TabBar` (der Rahmen), `Tab` (ein
     Reiter zum Anklicken) und `Panel` (der Inhalt hinter einem Reiter).
   - Achte darauf, welche Properties `Tab` und `Panel` erwarten und was sie
     damit machen. Auffällig: Keine der drei Komponenten weiß von sich aus,
     welcher Tab gerade aktiv ist.
   - Beachte auch, dass alle drei Komponenten **named exports** sind (kein `export default`). Der Import sieht deshalb so aus: `import { Panel, Tab, TabBar } from "./TabBar.tsx";`
2. Leg `src/components/PlantList.tsx` an.
   - Verschieb das Array mit den Beispieldaten aus `App` in diese Datei, wieder
     außerhalb der Komponentenfunktion.
   - Die Komponente hat keine Properties und gibt die `PlantCardList` mit den
     Beispieldaten zurück.
   - 🧐 Warum eine eigene Komponente für zwei Zeilen? Weil `App` damit nur noch
     weiß, *dass* es eine Pflanzenliste gibt, nicht *woher* die Daten kommen.
     Später kommen sie aus dem Backend, und `App` merkt davon nichts.
3. Leg in `App` einen State für den gerade aktiven Tab an (`useState`).
   - Als Startwert nimmst du die Kennung des Tabs, der beim Start zu sehen sein
     soll, z.B. `"list"`.
4. Bau in `App` die `TabBar` zusammen:
   - zwei `Tab`-Elemente mit den Beschriftungen "Pflanzen" und "Neue Pflanze"
   - zwei `Panel`-Elemente mit der `PlantList` und dem `PlantForm`
   - Jedes `Tab` und jedes `Panel` braucht eine `tabId`. Die `tabId` eines Tabs und die seines Panels müssen übereinstimmen, sonst passiert beim Klick nichts.
   - Hinweis: `PlantForm` ist bisher nur ein Platzhalter mit ein paar Feldern.
     Ein richtiges Formular bauen wir später daraus.
5. Reiche den State und die Setter-Funktion als Properties an **jeden** `Tab`
   und an **jedes** `Panel` weiter.
   - Genau dieses Durchreichen nennt man **Prop Drilling**.
   - Wenn alles stimmt, kannst du zwischen den beiden Reitern hin- und
     herschalten, und der Reiter, auf dem du gerade stehst, ist deaktiviert.

## Material

- React
  - `useState`: https://react.dev/reference/react/useState
  - Properties an Komponenten übergeben:
    https://react.dev/learn/passing-props-to-a-component
  - Bedingtes Rendern: https://react.dev/learn/conditional-rendering
  - `children`-Property:
    https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children
- TypeScript
  - `ReactNode` (der Typ für `children`) wird aus `"react"` importiert

