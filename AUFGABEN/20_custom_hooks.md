# Eigene Hooks (Custom Hooks)

## Dateien

- `src/components/useTabBar.ts` (anlegen!)
- `src/components/App.tsx`
- `src/components/TabBar.tsx` (nur lesen, bleibt in dieser Übung unverändert)

## Aufgabe

Der Zustand der `TabBar` (welcher Tab ist gerade aktiv?) liegt bisher als
`useState` direkt in `App`. Du ziehst ihn in einen eigenen Hook `useTabBar`
heraus. Der Hook liefert nicht nur den Zustand zurück, sondern gleich fertige
Property-Pakete für `Tab` und `Panel`.

Am Ende steht in `App` kein `useState` mehr, und ein Tab sieht nur noch so aus:

```tsx
<Tab {...getTabProps("list")}>Pflanzen</Tab>
```

## Schritte

1. Lege die Datei `src/components/useTabBar.ts` an (`.ts`, nicht `.tsx`, denn hier entsteht kein JSX).
2. Schreib darin eine Funktion `useTabBar`, die einen Parameter
   `initialTabId: string` entgegennimmt.
   - Der Name **muss** mit `use` anfangen. Nur dann behandeln React und die
     ESLint-Regeln sie als Hook.
3. Ruf in der Funktion `useState(initialTabId)` auf. Das ist derselbe Aufruf, der bisher in `App` stand, verschieb ihn einfach dorthin.
4. Schreib im Hook zwei Funktionen:
   - `getTabProps(tabId)` gibt genau die Properties zurück, die ein `Tab`
     braucht (`tabId`, `activeTabId`, `onTabChange`)
   - `getPanelProps(tabId)` tut dasselbe für ein `Panel` (`tabId`, `activeTabId`)

   Gib am Ende ein Objekt mit dem aktuellen Wert und den beiden Funktionen
   zurück: `return { activeTabId, getTabProps, getPanelProps };`
5. Stell `App` um:
   - `const { getTabProps, getPanelProps } = useTabBar("list");`
   - Bei jedem `Tab` und jedem `Panel` die drei bzw. zwei einzelnen Properties
     durch `{...getTabProps("list")}` bzw. `{...getPanelProps("list")}`
     ersetzen. Die drei Punkte sind die normale JavaScript-Spread-Syntax: Alle
     Eigenschaften des Objekts werden als Properties übergeben.
   - Der `useState`-Import in `App` wird dadurch überflüssig.
6. Probier es aus: Das Umschalten muss sich genau wie vorher verhalten.
7. 🧐 Der Parameter des Hooks heißt `initialTabId`, nicht `activeTabId`. Warum
   ist das mehr als Kosmetik? Was würde passieren, wenn `App` beim nächsten
   Render einen anderen Wert übergibt? (Denk an das Thema "controlled vs.
   uncontrolled" von vorhin.)

## Material

- React
  - Eigene Hooks schreiben:
    https://react.dev/learn/reusing-logic-with-custom-hooks
  - Regeln für Hooks: https://react.dev/reference/rules/rules-of-hooks
- MDN
  - Spread-Syntax:
    https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Operators/Spread_syntax
