import { ReactNode } from "react";

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

type TabBarProps = {
  children: ReactNode;
};

/**
 * Äußerer Rahmen der Tab-Navigation. Rendert alle Kinder,
 * also die `Tab`- und `Panel`-Elemente.
 */
export function TabBar({ children }: TabBarProps) {
  return <div className={"TabBar"}>{children}</div>;
}

type TabProps = {
  /** Benennt diesen Tab, z.B. "list" */
  tabId: string;
  /** Nennt den Tab, der gerade aktiv ist */
  activeTabId: string;
  /** Wird aufgerufen, wenn dieser Tab angeklickt wird */
  onTabChange: (newTabId: string) => void;
  /** Die Beschriftung des Tab-Buttons */
  children: ReactNode;
};

/**
 * Ein einzelner Tab-Button in der Navigationsleiste.
 *
 * Ist dieser Tab gerade aktiv, wird der Button deaktiviert.
 */
export function Tab({ tabId, activeTabId, onTabChange, children }: TabProps) {
  const isActive = tabId === activeTabId;

  return (
    <button
      className={"Tab"}
      disabled={isActive}
      onClick={() => onTabChange(tabId)}
    >
      {children}
    </button>
  );
}

type PanelProps = {
  /** Nennt den Tab, zu dem dieses Panel gehört */
  tabId: string;
  /** Nennt den Tab, der gerade aktiv ist */
  activeTabId: string;
  /** Wird angezeigt, solange der Tab aktiv ist */
  children: ReactNode;
};

/**
 * Der Inhalt, der zu einem Tab gehört.
 *
 * Wenn die tabId nicht der activeTabId entspricht, wird nichts gerendert
 * (nur der aktive Tab soll dargestellt werden).
 */
export function Panel({ tabId, activeTabId, children }: PanelProps) {
  if (tabId !== activeTabId) {
    return null;
  }

  return <div className={"TabPanel"}>{children}</div>;
}
