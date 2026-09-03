import { z } from "zod";

// export type IPlantFormState = {
//   name: string,
//   location: string,
//   wateringInterval: number,
//   lastWatered?: string,
// }

// zod
export const PlantFormState = z.object({
  name: z.string().min(1, "Bitte gültigen Namen eingeben"),
  location: z.string().nonempty("Bitte Location eingeben"),
  wateringInterval: z.number().min(1),
  lastWatered: z.iso.date().optional(),
  // vermoegen: z.number(),
  // anlageBetrag: z.number()
})
  // .sup(
  // (values) => {
  //   if (values.anlageBetrag > values.vermoegen) {
  //     return false;
  //   }
  //   return true;
  // },
  // {
  //   error: "Anlagebetrag muss kleiner als Vermögen sein",
  //   path: ["vermoegen", "anlageBetrag"]
  // }
  // )

// const Person = {
//   firstname: "Klaus",
//   lastname: "Müller",
//   age: 32
// }
//
// type IPerson = typeof Person;

// function sayHello(person: IPerson) {
//   person.
// }


export type PlantFormState = z.infer<typeof PlantFormState>


// onSubmit
// const x = PlantFormState.parse({})
// saveFormToDatabase(x)
//
// function saveFormToDatabase(p: IPlantFormState) {
//
// }


