import { gql } from "@apollo/client";
import { useSuspenseQuery } from "@apollo/client/react";

import { GetPlantsDocument } from "../_generated-graphql-types.ts";
import FavoritePlantList from "./FavoritePlantList.tsx";
import PlantCardList from "./PlantCardList.tsx";

// 💬 Erzählen: unbenutzt, muss aber bleiben. Der Generator liest den Quelltext.
const PLANTS_QUERY = gql`
  query GetPlants {
    plants {
      id
      name
      location
      wateringInterval
      lastWatered
    }
  }
`;

export default function PlantList() {
  // 💬 kein Typparameter mehr: GetPlantsDocument bringt den Ergebnistyp mit
  const { data } = useSuspenseQuery(GetPlantsDocument);

  return (
    <div className={"PlantList"}>
      <div>
        <h2>Alle Pflanzen</h2>
        <PlantCardList plants={data.plants} />
      </div>
      <FavoritePlantList plants={data.plants} />
    </div>
  );
}
