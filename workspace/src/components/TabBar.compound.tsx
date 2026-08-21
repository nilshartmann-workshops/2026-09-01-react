import { createContext, ReactNode, useContext, useState } from "react";

// Dieselbe TabBar wie nebenan, nur mit einer anderen Schnittstelle nach außen.
// Die Datei wird nirgends benutzt, sie ist zum Zeigen da.

type TabBarContextValue = {
  activeTabId: string;
  onTabChange: (tabId: string) => void;
};

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
  children: ReactNode;
};

export function TabBar({ defaultTabId, children }: TabBarProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId);

  return (
    <TabBarContext value={{ activeTabId, onTabChange: setActiveTabId }}>
      <div className={"TabBar"}>{children}</div>
    </TabBarContext>
  );
}

type TabProps = {
  tabId: string;
  children: ReactNode;
};

// 💬 kein `export` mehr: Tab und Panel sind nur noch über TabBar erreichbar
function Tab({ tabId, children }: TabProps) {
  const { activeTabId, onTabChange } = useTabBarContext();

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
  tabId: string;
  children: ReactNode;
};

function Panel({ tabId, children }: PanelProps) {
  const { activeTabId } = useTabBarContext();

  if (tabId !== activeTabId) {
    return null;
  }

  return <div className={"TabPanel"}>{children}</div>;
}

// 💬 Das ist alles. Muss am Ende der Datei stehen, nach den Funktionen.
TabBar.Tab = Tab;
TabBar.Panel = Panel;
