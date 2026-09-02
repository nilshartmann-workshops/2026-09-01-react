import { useState } from "react";
import { Panel, Tab, TabBar } from "./TabBar.tsx";
import PlantCardList from "./PlantCardList.tsx";
import PlantForm from "./PlantForm.tsx";
import RenderSpielwiese from "../spielwiese/RenderSpielwiese.tsx";
import PlantList from "./PlantList.tsx";

export default function App() {
  const [activeTabId, setActiveTabId] = useState("list");

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
          Render Spielwiese
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
      </TabBar>
    </div>
  );
}
