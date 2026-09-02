import { useState } from "react";
import { Panel, Tab, TabBar } from "./TabBar.tsx";
import PlantCardList from "./PlantCardList.tsx";
import PlantForm from "./PlantForm.tsx";
import RenderSpielwiese from "../spielwiese/RenderSpielwiese.tsx";
import PlantList from "./PlantList.tsx";
import EffektSpielwiese from "../spielwiese/EffektSpielwiese.tsx";


// 1. Render Phase  => virtueller DOM  KEINE Seiteneffekte
// 2. Commit Phase => DOM aktualisiert Seiteneffekte ERLAUBT
export default function App() {
  const [activeTabId, setActiveTabId] = useState("list");

  // window.document.title = "Plantify";
  // setTimeout( ()=> { /* ... */}, 1000);

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
          Render
        </Tab>

        <Tab
          tabId={"effekte"}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        >
          Effekte
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
