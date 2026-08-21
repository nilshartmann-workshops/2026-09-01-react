import EffektSpielwiese from "../spielwiese/EffektSpielwiese.tsx";
import RenderSpielwiese from "../spielwiese/RenderSpielwiese.tsx";
import PlantForm from "./PlantForm.tsx";
import PlantList from "./PlantList.tsx";
import { Panel, Tab, TabBar } from "./TabBar.tsx";
import { useTabBar } from "./useTabBar.ts";

export default function App() {
  const { getTabProps, getPanelProps } = useTabBar("list");

  return (
    <div className={"AppContainer"}>
      <TabBar>
        <Tab {...getTabProps("list")}>Pflanzen</Tab>
        <Tab {...getTabProps("form")}>Neue Pflanze</Tab>
        <Tab {...getTabProps("render")}>Rendern (Spielwiese)</Tab>
        <Tab {...getTabProps("effekte")}>Effekte (Spielwiese)</Tab>

        <Panel {...getPanelProps("list")}>
          <PlantList />
        </Panel>
        <Panel {...getPanelProps("form")}>
          <PlantForm />
        </Panel>
        <Panel {...getPanelProps("render")}>
          <RenderSpielwiese />
        </Panel>
        <Panel {...getPanelProps("effekte")}>
          <EffektSpielwiese />
        </Panel>
      </TabBar>
    </div>
  );
}
