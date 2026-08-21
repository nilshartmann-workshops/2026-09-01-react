/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type G_CreatePlantInput = {
  /** ISO-Datum, YYYY-MM-DD */
  lastWatered?: string | null | undefined;
  location: string;
  name: string;
  notes?: string | null | undefined;
  wateringInterval: number;
};

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

export type G_CreatePlantVariables = Exact<{
  input: G_CreatePlantInput;
}>;


export type G_CreatePlant = {
  createPlant:
    | {
      __typename: 'CreatePlantError',
      msg: string
    }
    | {
      __typename: 'CreatePlantSuccess',
      plant: {
        __typename: 'Plant',
        id: string,
        name: string,
        location: string,
        wateringInterval: number,
        lastWatered: string | null
      }
    }

};


export const GetPlantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPlants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"wateringInterval"}},{"kind":"Field","name":{"kind":"Name","value":"lastWatered"}}]}}]}}]} as unknown as DocumentNode<G_GetPlants, G_GetPlantsVariables>;
export const CreatePlantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePlant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePlantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPlant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePlantSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"wateringInterval"}},{"kind":"Field","name":{"kind":"Name","value":"lastWatered"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePlantError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"msg"}}]}}]}}]}}]} as unknown as DocumentNode<G_CreatePlant, G_CreatePlantVariables>;