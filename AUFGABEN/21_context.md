# Context

## Dateien

- `src/components/TabBar.tsx`
- `src/components/App.tsx`
- `src/components/useTabBar.ts` (wird gelöscht)

## Aufgabe

`Tab` und `Panel` bekommen `activeTabId` und `onTabChange` bisher als Properties durchgereicht. Damit ist Schluss: Die `TabBar` verwaltet den aktiven Tab ab jetzt selbst und stellt ihn über einen **React Context** bereit. `Tab` und `Panel` holen sich die Werte von dort.

Von außen bleibt an einem Tab nur noch die `tabId` übrig:

```tsx
<TabBar defaultTabId="list">
  <Tab tabId="list">Pflanzen</Tab>
  <Panel tabId="list">…</Panel>
</TabBar>
```

## Schritte

1. Leg in `TabBar.tsx` den Context an:
   - Zuerst einen Typ für den transportierten Wert, z.B.
     `type ITabBarContext = { activeTabId: string; onTabChange: (tabId: string) => void }`
   - Dann `const TabBarContext = createContext<ITabBarContext | null>(null);`
   - **Wichtig:** Der Default-Wert ist `null`, und der Typparameter erlaubt `null` ausdrücklich. Der Default gilt genau dann, wenn ein `Tab` ohne umgebende `TabBar` gerendert wird, also im Fehlerfall. Wir denken uns dafür *keinen* Ersatzwert aus.
   - Der Context wird **nicht** exportiert. Niemand außerhalb dieser Datei
     soll ihn direkt benutzen.
2. Bau die `TabBar` um:
   - Sie bekommt eine neue Property `defaultTabId: string`.
   - Der `useState`-Aufruf, der bis eben im Hook `useTabBar` stand, zieht in
     die `TabBar`: `const [activeTabId, setActiveTabId] = useState(defaultTabId)`.
   - Umschließ das bisherige `<div className="TabBar">` mit dem Provider und
     gib ihm den Context-Wert mit:
     `<TabBarContext value={{ activeTabId, onTabChange: setActiveTabId }}>`
   - **Hinweis:** Seit React 19 rendert man den Context direkt als Provider.
     In älterem Code und in fast allen Beispielen im Netz steht stattdessen
     `<TabBarContext.Provider value={…}>`. Beides funktioniert.
3. Schreib den internen Hook, der den Fehlerfall abfängt:
   ```ts
   function useTabBarContext(): ITabBarContext {
     // useContext aufrufen, bei null einen Error werfen, sonst den Wert zurückgeben
   }
   ```
   - Er wird nicht exportiert; er ist nur für `Tab` und `Panel` da.
4. Stell `Tab` und `Panel` um:
   - `activeTabId` und `onTabChange` fliegen aus den Props-Typen raus. Übrig
     bleiben `tabId` und `children`.
   - Stattdessen ganz oben in der Komponente: `const { activeTabId, onTabChange } = useTabBarContext();`
   - Der Rest der beiden Komponenten bleibt, wie er ist.
5. Räum in `App` auf:
   - `<TabBar defaultTabId="list">` statt des Hook-Aufrufs
   - An `Tab` und `Panel` nur noch `tabId`
   - Der Import von `useTabBar` wird überflüssig. Lösch die Datei `useTabBar.ts`, ihr Inhalt steckt jetzt in der `TabBar`. Was von der Übung davor bleibt, ist das *Muster*: `useTabBarContext` ist wieder ein eigener Hook.
6. Probier es aus. Die Anwendung muss sich unverändert verhalten, denn du hast nichts an der Funktion geändert, nur daran, wie die Daten transportiert werden.
7. Prüf das Render-Verhalten. Füg unterhalb der `TabBar`-Komponente eine (neue) Komponente ein, die **nicht** den Context verwendet:
   ```ts
   // LogRender.tsx (neue Datei)
   function LogRender() {
     // kein Context-Zugriff!
     console.log("Rendering LogRender!", new Date().toLocaleTimeString());
     return <div>Nur ein Platzhalter. Ausgabe auf der Konsole</div>
   }
   
   // App.tsx
   <TabBar>
     ...
     <LogRender />
   </TabBar>
   ```
8. 🧐 Mach den Fehlerfall einmal absichtlich: Schreib in `App` ein
   `<Tab tabId="test">Test</Tab>` **außerhalb** der `<TabBar>`. Was siehst du
   im Browser, was in der Konsole? Nimm es danach wieder raus.

## Material

- React
  - Daten tief durchreichen mit Context:
    https://react.dev/learn/passing-data-deeply-with-context
  - `createContext`: https://react.dev/reference/react/createContext
  - `useContext`: https://react.dev/reference/react/useContext
  - Bevor du Context einsetzt (lesenswert!):
    https://react.dev/learn/passing-data-deeply-with-context#before-you-use-context
