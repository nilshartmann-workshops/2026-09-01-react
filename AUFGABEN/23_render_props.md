# Exkurs: Render Props

**Keine Übung**, das schauen wir uns gemeinsam an. Diese Datei ist die Mitschrift dazu.

## Dateien

- `src/components/TabBar.renderprop.tsx` (dieselbe `TabBar` wie nebenan, nur mit einer anderen Schnittstelle nach außen; sie wird nirgends benutzt)

## Der Trick

`children` ist hier keine JSX-Struktur, sondern eine **Funktion**. Die `TabBar` hält den Zustand weiter selbst, aber statt ihn per Context nach unten zu verteilen, gibt sie ihn als Parameter an die Funktion zurück nach oben. Der Aufrufer entscheidet, was damit passiert.

Das ist die ganze Umsetzung:

```tsx
export function TabBar({ defaultTabId, children }: TabBarProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId);

  return (
    <div className={"TabBar"}>{children(activeTabId, setActiveTabId)}</div>
  );
}
```

In JSX sieht das ungewohnt aus, ist aber nichts Besonderes: Zwischen den Tags steht ein Ausdruck, und dieser Ausdruck ist eben eine Funktion.

## Was man davon hat, und was es kostet

Dafür spricht:

- Der Aufrufer kommt an den Wert heran, nicht nur an die vorgefertigten Kinder.
  Die Überschrift im Beispiel unten ist mit Context nicht machbar, ohne dafür
  eine weitere Komponente zu bauen.
- Kein Context, kein Provider, keine Regel "nur innerhalb von".

Dagegen spricht:

- Prop Drilling ist zurück: `activeTabId` und `onTabChange` stehen wieder an
  jedem einzelnen `Tab` und `Panel`. Bei unseren paar Tabs geht das, bei zehn
  wird der Aufruf unübersichtlich.
- Verschachtelt man zwei solcher Komponenten ineinander, steht man in einer
  Funktion in einer Funktion in einer Funktion.

Deshalb ist das hier die *Zwischenstufe*: Sie zeigt, dass man Zustand auch ohne Context nach außen geben kann, aber sie löst das Problem von vorhin nur zur Hälfte. Genau darum hat Context gewonnen.

Erledigt ist die Form damit trotzdem nicht. Wenn eine **Bibliothek** eine Komponente anbietet, weiß sie nicht, was der Anwender rendern will, und dann ist eine Funktion als `children` genau richtig. Uns begegnet das später noch einmal, und dann ist es kein Rückschritt, sondern die naheliegende Lösung.

## Zum Vorführen

In `App.tsx` den Import auf diese Datei umbiegen ...

```tsx
import { Panel, Tab, TabBar } from "./TabBar.renderprop.tsx";
```

... und den `return`-Block ersetzen:

```tsx
return (
  <div className={"AppContainer"}>
    <TabBar defaultTabId={"list"}>
      {(activeTabId, onTabChange) => (
        <>
          <h2>Aktiver Tab: {activeTabId}</h2>

          <Tab
            tabId={"list"}
            activeTabId={activeTabId}
            onTabChange={onTabChange}
          >
            Pflanzen
          </Tab>
          {/* ... die übrigen Tabs genauso ... */}

          <Panel tabId={"list"} activeTabId={activeTabId}>
            <PlantList />
          </Panel>
          {/* ... die übrigen Panels genauso ... */}
        </>
      )}
    </TabBar>
  </div>
);
```

## Material

- React, `children` als Funktion:
  <https://react.dev/reference/react/cloneElement#passing-data-with-a-render-prop>
