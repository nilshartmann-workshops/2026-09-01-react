# Externes State-Management mit Zustand

## Dateien

- `src/components/useFavoritesStore.ts` (anlegen!)
- `src/components/FavoritePlantList.tsx` (anlegen!)
- `src/components/PlantCard.tsx`
- `src/components/PlantCardList.tsx`
- `src/components/PlantList.tsx`

## Aufgabe

Pflanzen sollen sich als Favorit markieren lassen. Der Favoritenstatus ist globaler Zustand: Die `PlantCard` schaltet ihn um, und eine zweite Liste (`FavoritePlantList`) zeigt nur die markierten Pflanzen, ohne dass zwischen den beiden irgendetwas durchgereicht wird.

Die Bibliothek [Zustand](https://zustand.docs.pmnd.rs/) ist schon installiert.

## Schritte

1. Leg `src/components/useFavoritesStore.ts` an:
   - `import { create } from "zustand";`
   - Ein Typ für den Store: `favoriteIds: string[]` und
     `toggleFavorite: (id: string) => void`
   - `export const useFavoritesStore = create<FavoritesStore>()((set) => ({ … }))`
   - **Zur zweiten Klammer:** `create<T>()(…)` sieht seltsam aus und ist ein
     reines TypeScript-Detail. Es gibt keine Möglichkeit, nur *einen*
     Typparameter anzugeben und den Rest ableiten zu lassen; der Aufruf wird
     deshalb in zwei zerlegt. Ohne Zusatzpakete geht auch `create<T>(…)`, aber
     sobald eine Middleware dazukommt (`persist`, `devtools`, `immer`),
     braucht man diese Form.
   - 🧐 Warum legen wir nur die Ids in den Store und nicht die ganzen
     `Plant`-Objekte?
2. Schreib die eigentliche Logik als **normale Funktion**, oberhalb des Stores:

   ```ts
   function toggle(ids: string[], id: string): string[] {
     return ids.includes(id) ? ids.filter((fId) => fId !== id) : [...ids, id];
   }
   ```

   - Das ist reines JavaScript und hat mit Zustand nichts zu tun. Genau deshalb
     steht es getrennt: Man kann es einzeln lesen, einzeln testen und einzeln
     erklären.
   - **Achtung:** Immer ein **neues** Array zurückgeben (`filter`, Spread), niemals `push` auf das bestehende. Zustand erkennt eine Änderung am Referenzvergleich, genau wie React.
3. Verdrahte die Funktion im Store:

   ```ts
   toggleFavorite: (id) =>
     set((state) => ({ favoriteIds: toggle(state.favoriteIds, id) })),
   ```

   - Was du an `set` zurückgibst, ist ein **Teil**-Zustand: Zustand mischt ihn
     flach in den Store. Deshalb genügt `{ favoriteIds: … }`, auch wenn der
     Store später mehr Felder hat.
4. Gib der `PlantCard` einen Favoriten-Button:
   - Sie braucht dafür eine neue Property `id: string`. In `PlantCardList` musst du sie mitgeben, denn der `key` reicht **nicht**: Der ist nur für React und kommt in der Komponente gar nicht an.
   - Lies den Zustand fürs Erste bequem aus:
     `const { favoriteIds, toggleFavorite } = useFavoritesStore();`
   - Zeig je nach Status "💚 Favorit" oder "🤍 Favorit" an, und ruf beim Klick
     `toggleFavorite(id)` auf. Der Button gehört ins `<header>` der Karte,
     dann sitzt er richtig.
5. Bau die `FavoritePlantList` (`src/components/FavoritePlantList.tsx`):
   - Property: `plants: Plant[]`, sie bekommt also **alle** Pflanzen und filtert selbst.
   - Sie liest die `favoriteIds` aus dem Store und zeigt die gefilterte Liste
     mit `PlantCardList` an; ist nichts markiert, ein freundlicher Satz.
6. Häng sie in `PlantList` neben die bestehende Liste:
   ```tsx
   <div className="PlantList">
     <div>
       <h2>Alle Pflanzen</h2>
       <PlantCardList plants={allPlants} />
     </div>
     <FavoritePlantList plants={allPlants} />
   </div>
   ```
   - Die CSS-Klasse `PlantList` stellt die beiden Listen nebeneinander.
   - `App` fasst du dafür nicht an: Dort steht weiterhin nur `<PlantList />`.
   - Probier es aus: Ein Klick auf einer Karte in der linken Liste ändert sofort die rechte. Zwischen den beiden gibt es keine Verbindung außer dem Store, also kein Provider, keine Properties, kein gemeinsamer Vater mit State.
7. Zum Schluss machen wir sichtbar, wer eigentlich alles neu rendert. Häng dafür
   vorübergehend eine Zeile an den Anfang von `PlantCard`:
   ```tsx
   console.log("PlantCard rendert:", name);
   ```
   Öffne die Konsole und klick auf **einen** Favoriten-Button.
   - Ergebnis: **Alle** Karten rendern neu, auch die, die gar nicht betroffen
     sind. Grund: `useFavoritesStore()` ohne Argument abonniert den
     **kompletten** Store.
   - Wer die React DevTools installiert hat, kann es sich auch dort ansehen:
     Tab "Components" → Zahnrad → "Highlight updates when components render".
   - Lass den `console.log` stehen, in der nächsten Übung räumen wir das auf.

## Material

- Zustand
  - Einführung: https://zustand.docs.pmnd.rs/getting-started/introduction
  - Mit TypeScript (dort steht auch, warum `create<T>()(…)`):
    https://zustand.docs.pmnd.rs/guides/typescript
  - Middleware `immer` für tief verschachtelten Zustand, bei dem die
    unveränderliche Fortschreibung von Hand mühsam wird. Bei unserem flachen
    Array lohnt es nicht, installiert ist es trotzdem:
    https://zustand.docs.pmnd.rs/integrations/immer-middleware
- React
  - Warum rendert React neu? https://react.dev/learn/render-and-commit
  - React DevTools: https://react.dev/learn/react-developer-tools
