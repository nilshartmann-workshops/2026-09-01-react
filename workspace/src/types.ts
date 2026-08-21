import { G_GetPlants } from "./_generated-graphql-types.ts";

// 💬 Die Pointe: Der Typ beschreibt nicht "eine Pflanze", sondern das, was
//    unsere Query anfordert. Zeigen: Feld aus der Query nehmen -> Fehler hier.
export type Plant = G_GetPlants["plants"][number];
