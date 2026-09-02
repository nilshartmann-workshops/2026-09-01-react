import { gql } from "@apollo/client";
import { Plant } from "../types.ts";
import PlantCardList from "./PlantCardList.tsx";
import { useQuery, useSuspenseQuery } from "@apollo/client/react";

const allPlants: Plant[] = [
  {
    id: "1",
    name: "Aloe Vera",
    location: "Schlafzimmer",
    wateringInterval: 12,
    lastWatered: "2026-08-28",
  },
  {
    id: "2",
    name: "Orchidee",
    location: "Wohnzimmer",
    wateringInterval: 20,
  },
  {
    id: "3",
    name: "Kaktus Karl",
    location: "Arbeitszimmer",
    wateringInterval: 21,
    lastWatered: "2026-07-15",
  },
];

const PLANT_QUERY = gql`
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

  const result = useSuspenseQuery<{plants: Plant[]}>(PLANT_QUERY);

  const allPlants = result.data.plants;

  // loadPlantsFromServer()

  return <PlantCardList plants={allPlants} />;
}
