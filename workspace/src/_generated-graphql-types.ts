/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type G_DefaultPlant = {
  __typename: 'Plant',
  id: string,
  name: string,
  location: string,
  wateringInterval: number,
  lastWatered: string | null
};

export type G_GetPlantsVariables = Exact<{ [key: string]: never; }>;


export type G_GetPlants = {
  plants: Array<(
    {
    __typename: 'Plant'
  }
    & G_DefaultPlant
  )>
};

export type G_SinglePlantVariables = Exact<{
  plantId: string | number;
}>;


export type G_SinglePlant = {
  plant: {
    __typename: 'Plant',
    id: string,
    name: string,
    location: string,
    wateringInterval: number,
    lastWatered: string | null
  } | null
};

export const DefaultPlant = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DefaultPlant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Plant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"wateringInterval"}},{"kind":"Field","name":{"kind":"Name","value":"lastWatered"}}]}}]} as unknown as DocumentNode<G_DefaultPlant, unknown>;
export const GetPlantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPlants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DefaultPlant"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DefaultPlant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Plant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"wateringInterval"}},{"kind":"Field","name":{"kind":"Name","value":"lastWatered"}}]}}]} as unknown as DocumentNode<G_GetPlants, G_GetPlantsVariables>;
export const SinglePlantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SinglePlant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"plantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"plantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"wateringInterval"}},{"kind":"Field","name":{"kind":"Name","value":"lastWatered"}}]}}]}}]} as unknown as DocumentNode<G_SinglePlant, G_SinglePlantVariables>;