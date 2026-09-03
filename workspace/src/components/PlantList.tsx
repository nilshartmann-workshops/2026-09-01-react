import { gql } from "@apollo/client";
import { Plant } from "../types.ts";
import PlantCardList from "./PlantCardList.tsx";
import { useApolloClient, useQuery, useSuspenseQuery } from "@apollo/client/react";
import { GetPlantsDocument } from "../_generated-graphql-types.ts";
import { useEffect } from "react";


const PLANT_QUERY = gql`

  fragment DefaultPlant on Plant {
    id
    name
    location
    wateringInterval
    lastWatered
  }


  
  query GetPlants {
    plants {
     ...DefaultPlant
    }
  }
`;

export default function PlantList() {


  return <PlantListIntern />

}

function PlantListIntern() {
  const result = useSuspenseQuery(GetPlantsDocument);

  const allPlants = result.data.plants;

  // loadPlantsFromServer()

  return <PlantCardList plants={allPlants} />;
}
