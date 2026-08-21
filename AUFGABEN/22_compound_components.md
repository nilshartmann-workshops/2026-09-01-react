# Exkurs: Compound Components

**Keine Übung**, das schauen wir uns gemeinsam an. Diese Datei ist die Mitschrift dazu.

## Dateien

- `src/components/TabBar.compound.tsx` (dieselbe `TabBar` wie nebenan, nur mit einer anderen Schnittstelle nach außen; sie wird nirgends benutzt)

## Worum es geht

Unsere `TabBar` besteht aus drei Komponenten, die nur gemeinsam funktionieren. Nach außen sind es aber drei gleichberechtigte Exporte: Man importiert `TabBar`, `Tab` und `Panel` einzeln, und nichts am Import verrät, dass sie zusammengehören.

Bei "Compound Components" hängt man `Tab` und `Panel` stattdessen als Eigenschaften an die Funktion `TabBar`. Der Aufruf sieht dann so aus:

```tsx
<TabBar defaultTabId={"list"}>
  <TabBar.Tab tabId={"list"}>Pflanzen</TabBar.Tab>
  <TabBar.Panel tabId={"list"}>
    <PlantList />
  </TabBar.Panel>
</TabBar>
```

## Der technische Trick

Er steht ganz unten in der Datei und ist zwei Zeilen lang:

```tsx
TabBar.Tab = Tab;
TabBar.Panel = Panel;
```

In JavaScript ist eine Funktion ein Objekt, man darf ihr also etwas anhängen. React interessiert das nicht: Für React ist `<TabBar.Tab>` dasselbe wie `<Tab>`. Die beiden Zeilen müssen am Ende der Datei stehen, nach den Funktionsdeklarationen.

`Tab` und `Panel` werden dafür nicht mehr einzeln exportiert. Sie sind nur noch über `TabBar` erreichbar.

## Was man davon hat, und was es kostet

Dafür spricht:

- Der Aufrufer importiert einen Namen statt drei.
- Man sieht am Aufruf, dass die drei zusammengehören, fast wie bei `<select>`
  und `<option>` in HTML.

Dagegen spricht die implizite Kopplung: Was ein `<TabBar.Tab>` zum Funktionieren braucht, steht nicht am Aufruf, sondern im Context. Weder TypeScript noch der Linter merken, wenn er am falschen Platz steht. Erst der Hook `useTabBarContext` wirft zur Laufzeit einen Fehler.

## Zum Vorführen

In `App.tsx` den Import auf diese Datei umbiegen ...

```tsx
import { TabBar } from "./TabBar.compound.tsx";
```

... und im `return`-Block aus jedem `<Tab>` ein `<TabBar.Tab>` und aus jedem `<Panel>` ein `<TabBar.Panel>` machen.

## Material

- React, das `children`-Property:
  <https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children>
- Radix UI als Beispiel für diese Bauform:
  <https://www.radix-ui.com/primitives/docs/components/tabs>
