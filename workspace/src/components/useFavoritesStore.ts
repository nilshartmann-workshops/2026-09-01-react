import { create } from "zustand";

// 💬 Erzählen: der Store lebt außerhalb von React, kein Provider nötig
type FavoritesStore = {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
};

// 💬 Erzählen: die fachliche Regel, ohne Zustand. Immer ein *neues* Array,
//    nie push/splice, sonst sieht der Referenzvergleich keine Änderung.
function toggle(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((fId) => fId !== id) : [...ids, id];
}

// 💬 Erzählen: die leere Klammer nach create<T> ist ein TypeScript-Detail
export const useFavoritesStore = create<FavoritesStore>()((set) => ({
  favoriteIds: [],

  // 💬 Erzählen: `set` bekommt einen *Teil*-Zustand, den Zustand flach in den
  //    Store mischt
  toggleFavorite: (id) =>
    set((state) => ({ favoriteIds: toggle(state.favoriteIds, id) })),
}));

// 💬 Erzählen: Funktion, die eine Funktion zurückgibt. selectIsFavorite("3")
//    liefert den fertigen Selector für die Pflanze mit der Id 3.
export const selectIsFavorite =
  (id: string) =>
  (state: FavoritesStore): boolean =>
    state.favoriteIds.includes(id);
