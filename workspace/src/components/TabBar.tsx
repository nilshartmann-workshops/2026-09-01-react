import { createContext, ReactNode, useContext, useState } from "react";

/**
 * Eine Tab-Navigation aus drei Bausteinen: `TabBar` (der Rahmen), `Tab`
 * (ein Reiter zum Anklicken) und `Panel` (der Inhalt hinter einem Reiter).
 * Angezeigt wird nur das Panel des aktiven Tabs, ein Klick auf einen Reiter
 * macht ihn aktiv, und der Button des aktiven Reiters ist `disabled`.
 *
 * Verwendung:
 *
 *   <TabBar>
 *     <Tab tabId="list" activeTabId={activeTabId} onTabChange={setActiveTabId}>
 *       Pflanzen
 *     </Tab>
 *     <Panel tabId="list" activeTabId={activeTabId}>
 *       <PlantCardList ... />
 *     </Panel>
 *   </TabBar>
 *
 * ⚠️ Diese Datei ist fertig implementiert, du musst hier (noch) nichts machen.
 */

type ITabBarContext = {
  activeTabId: string;
  onTabChange: (newTabId: string) => void;
}

const TabBarContext = createContext<ITabBarContext|null>(null);


type TabBarProps = {
  initialTabId: string;
  children: ReactNode;
};

/**
 * Äußerer Rahmen der Tab-Navigation. Rendert alle Kinder,
 * also die `Tab`- und `Panel`-Elemente.
 */
export function TabBar({ initialTabId, children }: TabBarProps) {

  const [activeTabId, setActiveTabId] = useState(initialTabId);

  const contextValue: ITabBarContext = {
    activeTabId: activeTabId,
    onTabChange: setActiveTabId
  }

  return <div className={"TabBar"}>
    <TabBarContext value={contextValue}>
      {children}
    </TabBarContext>
  </div>;
}

type TabProps = {
  /** Benennt diesen Tab, z.B. "list" */
  tabId: string;
  /** Die Beschriftung des Tab-Buttons */
  children: ReactNode;
};

function useTabBarContext() {
  const ctx = useContext(TabBarContext);

  if (ctx === null) {
    throw new Error("Missing Context")
  }

  return ctx;
}

/**
 * Ein einzelner Tab-Button in der Navigationsleiste.
 *
 * Ist dieser Tab gerade aktiv, wird der Button deaktiviert.
 */
export function Tab({ tabId, children }: TabProps) {
  const ctx = useTabBarContext();

  const isActive = tabId === ctx.activeTabId;

  return (
    <button
      className={"Tab"}
      disabled={isActive}
      onClick={() => ctx.onTabChange(tabId)}
    >
      {children}
    </button>
  );
}

type PanelProps = {
  /** Nennt den Tab, zu dem dieses Panel gehört */
  tabId: string;
  children: ReactNode;
};

/**
 * Der Inhalt, der zu einem Tab gehört.
 *
 * Wenn die tabId nicht der activeTabId entspricht, wird nichts gerendert
 * (nur der aktive Tab soll dargestellt werden).
 */
export function Panel({ tabId, children }: PanelProps) {

  const ctx = useTabBarContext();

  if (tabId !== ctx.activeTabId) {
    return null;
  }

  return <div className={"TabPanel"}>{children}</div>;
}
