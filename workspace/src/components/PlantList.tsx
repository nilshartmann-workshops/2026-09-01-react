import { gql } from "@apollo/client";
import { useSuspenseQuery } from "@apollo/client/react";

import { Plant } from "../types.ts";
import FavoritePlantList from "./FavoritePlantList.tsx";
import PlantCardList from "./PlantCardList.tsx";

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
  const { data } = useSuspenseQuery<{ plants: Plant[] }>(PLANTS_QUERY);

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
