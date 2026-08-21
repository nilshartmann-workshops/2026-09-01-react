import { ReactNode, useState } from "react";

// Dieselbe TabBar wie nebenan, nur mit einer anderen Schnittstelle nach außen.
// Die Datei wird nirgends benutzt, sie ist zum Zeigen da.

type TabBarProps = {
  defaultTabId: string;
  // 💬 Erzählen: `children` bekommt hier den aktiven Tab und die
  //    Änderungsfunktion und gibt dafür JSX zurück
  children: (
    activeTabId: string,
    onTabChange: (tabId: string) => void,
  ) => ReactNode;
};

export function TabBar({ defaultTabId, children }: TabBarProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId);

  // 💬 Das ist alles: children ist eine Funktion, also wird sie aufgerufen.
  return (
    <div className={"TabBar"}>{children(activeTabId, setActiveTabId)}</div>
  );
}

type TabProps = {
  tabId: string;
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
};

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
  tabId: string;
  activeTabId: string;
  children: ReactNode;
};

export function Panel({ tabId, activeTabId, children }: PanelProps) {
  if (tabId !== activeTabId) {
    return null;
  }

  return <div className={"TabPanel"}>{children}</div>;
}
