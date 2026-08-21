// 💬 Diesen Typ pflegen wir erstmal von Hand. Später generieren wir ihn.
export type Plant = {
  id: string;
  name: string;
  location: string;
  wateringInterval: number;
  lastWatered?: string;
};
