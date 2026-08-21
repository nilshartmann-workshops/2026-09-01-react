# Selektoren: nur noch rendern, was sich wirklich geändert hat

## Dateien

- `src/components/useFavoritesStore.ts`
- `src/components/PlantCard.tsx`
- `src/components/FavoritePlantList.tsx`

## Vorbereitung

Erinnerung aus der vorherigen Übung: Der `console.log` am Anfang von `PlantCard` hat gezeigt, dass beim Klick auf **einen** Favoriten-Button **alle** Karten neu rendern. Wenn du das noch nicht ausprobiert hast, hol es jetzt nach. Häng die Zeile

```tsx
console.log("PlantCard rendert:", name);
```

an den Anfang von `PlantCard`, öffne die Konsole und klick einen Favoriten-Button an. Ohne diese Beobachtung ist der Rest der Übung nur Umbauen. Lass die Zeile stehen, wir brauchen sie am Ende noch einmal.

## Aufgabe

Dass alle Karten rendern, reparieren wir mit **Selektoren**: Jede Komponente sagt, was sie aus dem Store braucht, und rendert nur noch dafür.

## Schritte

1. Ein Selector ist eine Funktion, die aus dem Zustand nur das herausgreift,
   was die Komponente wirklich braucht. Zustand ruft sie nach *jeder* Änderung
   im Store auf, rendert die Komponente aber nur dann neu, wenn sich der
   *Rückgabewert* des Selektors seit dem letzten Mal geändert hat.

   Schreib den Selector in die **Store-Datei**, nicht in die Komponente:

   ```ts
   export const selectIsFavorite =
     (id: string) =>
     (state: FavoritesStore): boolean =>
       state.favoriteIds.includes(id);
   ```

   Das ist eine Funktion, die eine Funktion zurückgibt. `selectIsFavorite("3")`
   liefert den fertigen Selector für die Pflanze mit der Id 3.
2. Stell `PlantCard` um, auf zwei getrennte Zugriffe statt einem:

   ```ts
   const isFavorite = useFavoritesStore(selectIsFavorite(id));
   const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
   ```

   - Der erste Wert ändert sich nur, wenn **diese** Karte an- oder abgewählt wird. Der zweite ändert sich nie, denn es ist immer dieselbe Funktion.
3. Stell auch `FavoritePlantList` um:
   `useFavoritesStore((state) => state.favoriteIds)`.
4. Klick noch einmal auf einen Favoriten-Button und schau in die Konsole: Jetzt
   rendert nur noch **die eine** Karte neu, deren Status sich geändert hat.
   - Genau das ist der Unterschied zu purem Context: Dort rendert jeder
     Consumer bei jeder Änderung mit, und dagegen hilft weder `memo` noch
     `useMemo`.
   - Nimm den `console.log` danach wieder raus.
5. 🧐 Warum definieren wir `selectIsFavorite` in der Store-Datei und nicht in
   der Komponente? Was gewinnt man dadurch?

## Material

- Selektoren und Rendering:
  https://zustand.docs.pmnd.rs/guides/prevent-rerenders-with-use-shallow
- Zustand mit TypeScript: https://zustand.docs.pmnd.rs/guides/typescript
