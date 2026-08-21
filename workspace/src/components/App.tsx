import { Suspense } from "react";

import EffektSpielwiese from "../spielwiese/EffektSpielwiese.tsx";
import RenderSpielwiese from "../spielwiese/RenderSpielwiese.tsx";
import PlantForm from "./PlantForm.tsx";
import PlantList from "./PlantList.tsx";
import { Panel, Tab, TabBar } from "./TabBar.tsx";

export default function App() {
  return (
    <div className={"AppContainer"}>
      <TabBar defaultTabId={"list"}>
        <Tab tabId={"list"}>Pflanzen</Tab>
        <Tab tabId={"form"}>Neue Pflanze</Tab>
        <Tab tabId={"render"}>Rendern (Spielwiese)</Tab>
        <Tab tabId={"effekte"}>Effekte (Spielwiese)</Tab>

        <Panel tabId={"list"}>
          <Suspense
            fallback={
              <div className={"CardListFallback"}>
                Pflanzen werden geladen...
              </div>
            }
          >
            <PlantList />
          </Suspense>
        </Panel>
        <Panel tabId={"form"}>
          <PlantForm />
        </Panel>
        <Panel tabId={"render"}>
          <RenderSpielwiese />
        </Panel>
        <Panel tabId={"effekte"}>
          <EffektSpielwiese />
        </Panel>
      </TabBar>
    </div>
  );
}
