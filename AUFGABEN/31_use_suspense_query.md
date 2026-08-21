# Daten lesen mit useSuspenseQuery

## Dateien

- `src/components/PlantList.tsx`
- `src/components/App.tsx`
- `src/demo-config.ts`

## Vorbereitung

**Das Backend muss laufen**, in einem eigenen Terminal neben dem Devserver:

```bash
cd backend
npm start
```

Prüf kurz, ob es antwortet: Ruf <http://localhost:7200/graphql> im Browser auf. Es öffnet sich GraphiQL, eine Oberfläche zum Schreiben und Ausführen von Queries. Tipp links diese Abfrage ein und drück auf den Play-Button:

```graphql
query {
  plants {
    id
    name
    location
  }
}
```

Rechts sollte eine Liste von Pflanzen erscheinen. Wenn ja, ist alles bereit.

Apollo selbst ist schon eingerichtet: Client, Provider und alles Weitere liegen fertig im Projekt, du musst nichts konfigurieren.

## Aufgabe

Die Pflanzen sollen nicht mehr als Konstante in `PlantList` stehen, sondern vom Server kommen. Dafür schreibst du eine GraphQL-Query, führst sie mit `useSuspenseQuery` aus und zeigst währenddessen einen Platzhalter an.

Angefasst wird dafür genau eine Komponente. `App`, `PlantCardList`, `PlantCard` und `FavoritePlantList` bleiben, wie sie sind, und darauf kommen wir am Ende noch einmal zurück.

## Schritte

1. Schreib die Query, oben in `src/components/PlantList.tsx`:

   ```tsx
   import { gql } from "@apollo/client";

   const PLANTS_QUERY = gql`
     query GetPlants {
       plants {
         id
         name
         # ... hier fehlt noch etwas
       }
     }
   `;
   ```

   - Du brauchst genau die Felder, die `PlantCardList` und `PlantCard` benutzen.
   - **Gib der Query einen Namen** (`GetPlants`). Er ist technisch optional,
     aber wir brauchen ihn später wieder, wenn wir uns die TypeScript-Typen
     generieren lassen.
   - Tipp: Wenn du das GraphQL-Plug-in für deine IDE installiert hast, bekommst du hier Autovervollständigung, auch mitten im TypeScript-Code.
2. Führ die Query aus:

   ```tsx
   import { useSuspenseQuery } from "@apollo/client/react";

   const { data } = useSuspenseQuery<{ plants: Plant[] }>(PLANTS_QUERY);
   ```

   - Den Typparameter `<{ plants: Plant[] }>` brauchst du: Apollo kennt unsere
     Query nur als Text, ohne die Angabe ist `data` vom Typ `unknown`. Lass ihn
     ruhig einmal weg und schau dir die Meldung an.
   - Den handgeschriebenen `Plant`-Typ ersetzen wir später durch einen
     generierten.
   - Einen Ladezustand musst du **nicht** behandeln. Wenn `useSuspenseQuery`
     zurückkehrt, sind die Daten da. Das ist der ganze Punkt.
3. Ersetz die Konstante `allPlants` durch `data.plants` und lösch sie.
   - Beachte: `PlantCardList`, `PlantCard` und `FavoritePlantList` ändern sich
     **überhaupt nicht**. Sie bekommen weiterhin ein Array als Property und
     wissen nichts davon, dass die Daten jetzt aus dem Netz kommen.
   - 🧐 Und `App` auch nicht, dort steht weiterhin `<PlantList />`. Genau dafür haben wir die Komponente damals angelegt: `App` weiß, *dass* es eine Pflanzenliste gibt, nicht *woher* sie ihre Daten hat.
4. Zeig einen Platzhalter während des Ladens. Häng dazu in `App` eine
   `<Suspense>`-Grenze um die `PlantList`:

   ```tsx
   <Suspense fallback={<div className={"CardListFallback"}>Pflanzen werden geladen...</div>}>
     <PlantList />
   </Suspense>
   ```

   - `Suspense` kommt aus `react`, nicht aus Apollo.
   - Du siehst den Fallback erst, wenn das Laden lange genug dauert, bei einem
     Backend auf dem eigenen Rechner also praktisch nie. Trag deshalb in
     `src/demo-config.ts` eine Verzögerung ein:

     ```ts
     export const delayConfig: Record<string, number> = {
       GetPlants: 2000, // <- war 0
       CreatePlant: 0,
     };
     ```

   - **Der Schlüssel muss exakt der Name deiner Operation sein.** Hast du deine Query anders genannt als `GetPlants`, trag deinen Namen ein. Schreibt man ihn falsch, passiert einfach gar nichts, und man sucht den Fehler an der falschen Stelle.
5. Probier verschiedene Stellen für die `Suspense`-Grenze aus: um die
   `PlantList`, um das ganze Panel, ganz außen um die `TabBar`.
   - Faustregel: dorthin, wo ein Platzhalter fachlich Sinn ergibt. Wandert die Grenze nach außen, verschwindet beim Laden auch die Tab-Leiste, und das will man selten.
   - 🧐 Was passiert, wenn du gar keine `Suspense`-Grenze setzt?
6. 🧐 Optional (wenn du noch Zeit hast): Wechsel auf den Formular-Tab und wieder
   zurück. Wartest du wieder zwei Sekunden? Und was passiert, wenn du die Seite
   neu lädst? (Stichwort: Apollo hat einen Cache. Was da genau drinliegt, kannst
   du mit den Apollo Client DevTools anschauen.)
7. 🧐 Optional (wenn du noch Zeit hast): Nimm ein Feld aus der Query heraus, das die `PlantCard` benutzt, zum Beispiel `location`. Was sagt TypeScript? Und was zeigt die Anwendung?

## Material

- `useSuspenseQuery`:
  <https://www.apollographql.com/docs/react/api/react/useSuspenseQuery>
- React `<Suspense>`: <https://react.dev/reference/react/Suspense>
- GraphQL Queries: <https://graphql.org/learn/queries/>
- Apollo Client DevTools (zeigt laufende Operationen und den Cache):
  <https://www.apollographql.com/docs/react/development-testing/developer-tooling#apollo-client-devtools>
- **Import-Fallstrick beim Googeln:** `gql` kommt aus `@apollo/client`, die
  Hooks aus `@apollo/client/react`. Merkregel: alles mit React kommt aus dem
  `/react`-Pfad. In fast allen Blogposts steht noch die alte Variante (Apollo
  Client 3), in der alles aus `@apollo/client` kam. In unserem Projekt merkst
  du es sofort: Der falsche Import kompiliert gar nicht erst
  (*"Module '@apollo/client' has no exported member 'useSuspenseQuery'"*).
