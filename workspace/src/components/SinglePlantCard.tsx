import { gql } from "@apollo/client";
import { useSuspenseQuery } from "@apollo/client/react";
import { SinglePlantDocument } from "../_generated-graphql-types.ts";

const SINGLE_PANT_CARD = gql`
  query SinglePlant($plantId: ID!) {
    plant(id: $plantId) {
      id
      name
      location
      wateringInterval
      lastWatered
    }
  }
 `;

function SinglePlantCard() {
  const result = useSuspenseQuery(SinglePlantDocument, {
    variables: {
      plantId: "1"
    }
  })

  const p = result.data.plant;
}

