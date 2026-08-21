import { createContext, ReactNode, useContext, useRef, useState } from "react";

/**
 * Eine Tab-Navigation aus drei Bausteinen: `TabBar` (der Rahmen), `Tab`
 * (ein Reiter zum Anklicken) und `Panel` (der Inhalt hinter einem Reiter).
 * Angezeigt wird nur das Panel des aktiven Tabs, ein Klick auf einen Reiter
 * macht ihn aktiv, und der Button des aktiven Reiters ist `disabled`.
 *
 * Verwendung:
 *
 *   <TabBar defaultTabId="list">
 *     <Tab tabId="list">Pflanzen</Tab>
 *     <Panel tabId="list">
 *       <PlantCardList ... />
 *     </Panel>
 *   </TabBar>
 */

type TabBarContextValue = {
  activeTabId: string;
  onTabChange: (tabId: string) => void;
};

// 💬 Erzählen: Default `null` statt Fantasiewert, er gilt nur im Fehlerfall
const TabBarContext = createContext<TabBarContextValue | null>(null);

function useTabBarContext(): TabBarContextValue {
  const context = useContext(TabBarContext);

  if (!context) {
    throw new Error(
      "Tab und Panel müssen innerhalb von TabBar verwendet werden",
    );
  }

  return context;
}

type TabBarProps = {
  defaultTabId: string;
  /** Enthält die Tabs und Panels dieser TabBar */
  children: ReactNode;
};

/**
 * Äußerer Rahmen der Tab-Navigation. Rendert alle Kinder,
 * also die `Tab`- und `Panel`-Elemente.
 */
export function TabBar({ defaultTabId, children }: TabBarProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId);

  // 💬 Seit React 19 direkt als Provider; vorher <TabBarContext.Provider>
  // 💬 Zeigen: useMemo um den Wert legen -> ändert nichts. Es gibt hier nichts
  //    zu stabilisieren, activeTabId ändert sich ja wirklich.
  return (
    <TabBarContext value={{ activeTabId, onTabChange: setActiveTabId }}>
      <div className={"TabBar"}>{children}</div>
    </TabBarContext>
  );
}

type TabProps = {
  /** Benennt diesen Tab, z.B. "list" */
  tabId: string;
  /** Die Beschriftung des Tab-Buttons */
  children: ReactNode;
};

/**
 * Ein einzelner Tab-Button in der Navigationsleiste.
 *
 * Ist dieser Tab gerade aktiv, wird der Button deaktiviert.
 */
// 💬 Zeigen: Tab in memo() wickeln. Seine Properties sind konstant, der Zähler
//    läuft trotzdem weiter: memo vergleicht Properties, und ein Context ist
//    keine.
export function Tab({ tabId, children }: TabProps) {
  const { activeTabId, onTabChange } = useTabBarContext();

  /* eslint-disable react-hooks/refs -- Render-Zähler, Begründung in Child.tsx */
  const renderCount = useRef(0);
  renderCount.current++;
  const renders = renderCount.current;
  /* eslint-enable react-hooks/refs */

  const isActive = tabId === activeTabId;

  return (
    <button
      className={"Tab"}
      disabled={isActive}
      onClick={() => onTabChange(tabId)}
    >
      {children} <span className={"RenderCounter"}>{renders}×</span>
    </button>
  );
}

type PanelProps = {
  /** Nennt den Tab, zu dem dieses Panel gehört */
  tabId: string;
  /** Wird angezeigt, solange der Tab aktiv ist */
  children: ReactNode;
};

/**
 * Der Inhalt, der zu einem Tab gehört.
 *
 * Wenn die tabId nicht der activeTabId entspricht, wird nichts gerendert
 * (nur der aktive Tab soll dargestellt werden).
 */
export function Panel({ tabId, children }: PanelProps) {
  const { activeTabId } = useTabBarContext();

  if (tabId !== activeTabId) {
    return null;
  }

  return <div className={"TabPanel"}>{children}</div>;
}
