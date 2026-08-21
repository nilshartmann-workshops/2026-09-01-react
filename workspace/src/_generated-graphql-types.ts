/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type G_GetPlantsVariables = Exact<{ [key: string]: never; }>;


export type G_GetPlants = {
  plants: Array<{
    __typename: 'Plant',
    id: string,
    name: string,
    location: string,
    wateringInterval: number,
    lastWatered: string | null
  }>
};


export const GetPlantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPlants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"wateringInterval"}},{"kind":"Field","name":{"kind":"Name","value":"lastWatered"}}]}}]}}]} as unknown as DocumentNode<G_GetPlants, G_GetPlantsVariables>;