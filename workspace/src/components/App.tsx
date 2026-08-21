import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { Suspense } from "react";

import EffektSpielwiese from "../spielwiese/EffektSpielwiese.tsx";
import RenderSpielwiese from "../spielwiese/RenderSpielwiese.tsx";
import PlantErrorBoundary from "./PlantErrorBoundary.tsx";
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
          {/* 💬 Erzählen: Error Boundary *außen*, Suspense *innen* */}
          <PlantErrorBoundary>
            <Suspense
              fallback={
                <div className={"CardListFallback"}>
                  Pflanzen werden geladen...
                </div>
              }
            >
              <PlantList />
            </Suspense>
          </PlantErrorBoundary>
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

      {/* 💬 Zeigen: unten rechts das Logo aufklappen. Das Formular meldet sich
          dort von selbst an, sobald sein Tab offen ist. */}
      <TanStackDevtools plugins={[formDevtoolsPlugin()]} />
    </div>
  );
}
