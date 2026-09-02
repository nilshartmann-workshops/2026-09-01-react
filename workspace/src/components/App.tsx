import { Suspense, useState } from "react";
import { Panel, Tab, TabBar } from "./TabBar.tsx";
import PlantCardList from "./PlantCardList.tsx";
import PlantForm from "./PlantForm.tsx";
import RenderSpielwiese from "../spielwiese/RenderSpielwiese.tsx";
import PlantList from "./PlantList.tsx";
import EffektSpielwiese from "../spielwiese/EffektSpielwiese.tsx";


// 1. Render Phase  => virtueller DOM  KEINE Seiteneffekte
// 2. Commit Phase => DOM aktualisiert Seiteneffekte ERLAUBT
export default function App() {


  // window.document.title = "Plantify";
  // setTimeout( ()=> { /* ... */}, 1000);

  return (
    <div className={"AppContainer"}>
      <TabBar initialTabId={"form"}>
        <Tab
          tabId={"list"}
        >
          Pflanzen
        </Tab>
        <Tab
          tabId={"form"}
        >
          Neue Pflanze
        </Tab>
        <Tab
          tabId={"render"}
        >
          Render
        </Tab>

        <Tab
          tabId={"effekte"}
        >
          Effekte
        </Tab>
        <Panel tabId={"list"} >
          <Suspense fallback={<div className={"CardListFallback"}>
            Pflanzen werden geladen...
          </div>}>
            <PlantList />
          </Suspense>
        </Panel>
        <Panel tabId={"form"} >
          <PlantForm />
        </Panel>
        <Panel tabId={"render"} >
          <RenderSpielwiese />
        </Panel>
        <Panel tabId={"effekte"} >
          <EffektSpielwiese />
        </Panel>
      </TabBar>
    </div>
  );
}
