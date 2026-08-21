// 💬 Erzählen: handgeschriebener Typ, wird später durch zod ersetzt
export type PlantFormState = {
  name: string;
  location: string;
  wateringInterval: number;
  lastWatered?: string;
};
