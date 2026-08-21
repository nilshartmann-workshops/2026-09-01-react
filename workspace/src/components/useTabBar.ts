import { useState } from "react";

// 💬 Erzählen: "initialTabId", weil der Hook uncontrolled ist, wie useState
export function useTabBar(initialTabId: string) {
  const [activeTabId, setActiveTabId] = useState(initialTabId);

  function getTabProps(tabId: string) {
    return {
      tabId,
      activeTabId,
      onTabChange: setActiveTabId,
    };
  }

  function getPanelProps(tabId: string) {
    return {
      tabId,
      activeTabId,
    };
  }

  return { activeTabId, getTabProps, getPanelProps };
}
