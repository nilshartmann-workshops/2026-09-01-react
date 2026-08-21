import { useState } from "react";

import EffektSpielwiese from "../spielwiese/EffektSpielwiese.tsx";
import RenderSpielwiese from "../spielwiese/RenderSpielwiese.tsx";
import PlantForm from "./PlantForm.tsx";
import PlantList from "./PlantList.tsx";
import { Panel, Tab, TabBar } from "./TabBar.tsx";

export default function App() {
  const [activeTabId, setActiveTabId] = useState("list");

  // 💬 Erzählen: activeTabId und onTabChange an jedem Tab und jedem Panel.
  //    Was passiert, wenn zwischen App und Tab noch eine Ebene dazukommt?

  return (
    <div className={"AppContainer"}>
      <TabBar>
        <Tab
          tabId={"list"}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        >
          Pflanzen
        </Tab>
        <Tab
          tabId={"form"}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        >
          Neue Pflanze
        </Tab>
        <Tab
          tabId={"render"}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        >
          Rendern (Spielwiese)
        </Tab>
        <Tab
          tabId={"effekte"}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        >
          Effekte (Spielwiese)
        </Tab>

        <Panel tabId={"list"} activeTabId={activeTabId}>
          <PlantList />
        </Panel>
        <Panel tabId={"form"} activeTabId={activeTabId}>
          <PlantForm />
        </Panel>
        <Panel tabId={"render"} activeTabId={activeTabId}>
          <RenderSpielwiese />
        </Panel>
        <Panel tabId={"effekte"} activeTabId={activeTabId}>
          <EffektSpielwiese />
        </Panel>
      </TabBar>
    </div>
  );
}
