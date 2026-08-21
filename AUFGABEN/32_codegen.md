# Typsicherheit mit GraphQL Codegen

## Dateien

- `src/components/PlantList.tsx`
- `src/types.ts`
- `src/components/PlantCard.tsx`
- `src/_generated-graphql-types.ts` (entsteht beim Generieren)

## Vorbereitung

**Das Backend muss laufen.** Der Generator holt sich das Schema über die URL `http://localhost:7200/graphql`, und läuft der Server nicht, bricht er ab. Das ist mit Abstand die häufigste Ursache, wenn hier etwas nicht klappt.

Der Generator selbst ist schon eingerichtet: `codegen.ts`, `graphql.config.yml` und die nötigen Pakete liegen fertig im Projekt. **Diese Dateien schreibst du nicht**, wir schauen sie nur einmal gemeinsam an.

## Aufgabe

Ganz am Anfang haben wir `type Plant` von Hand geschrieben. Inzwischen kommen die Daten vom Server, und dieser Typ ist eine Behauptung, die niemand prüft. Jetzt lassen wir ihn uns aus dem Schema ableiten. Die Datei `types.ts` bleibt, ihr Inhalt wird ein Einzeiler.

## Schritte

1. Wirf einen Blick in `codegen.ts` und `graphql.config.yml`. Drei Dinge stehen
   da drin, und mehr musst du dir nicht merken:
   - **woher das Schema kommt**: die URL des laufenden Backends
   - **wo der Generator nach Operationen sucht**: `documents`, also unser
     Quelltext. Er liest die Dateien, nicht die laufende Anwendung.
   - **wohin er schreibt**: `src/_generated-graphql-types.ts`
2. Lass den Generator einmal laufen:

   ```bash
   npm run graphql:codegen
   ```

   Mach danach `src/_generated-graphql-types.ts` auf und schau sie dir an. Die
   Datei hat drei Teile:
   - ganz oben ein bisschen internes Beiwerk
   - für jede Operation ein Typ mit dem Ergebnis (`G_GetPlants`) und einer für
     die Variablen (`G_GetPlantsVariables`, bei uns noch leer)
   - ganz unten pro Operation eine `…Document`-Konstante. Das ist die Query in
     der Form, in der Apollo sie versteht, mit dem Ergebnistyp fest daran.

   Der `G_`-Präfix ist reiner Geschmack ("G" wie GraphQL), damit man den
   generierten Typen ansieht, woher sie kommen.
3. Stell die Query in `PlantList` auf das generierte Document um:

   ```tsx
   import { GetPlantsDocument } from "../_generated-graphql-types.ts";

   const { data } = useSuspenseQuery(GetPlantsDocument);
   ```

   - Der Typparameter `<{ plants: Plant[] }>` fällt weg, denn der Typ steckt jetzt im Document. Damit brauchst du hier auch den `Plant`-Import nicht mehr.
   - **Die `PLANTS_QUERY`-Konstante bleibt stehen**, obwohl sie niemand mehr benutzt. Sie ist es ja, aus der der Generator die Query liest. Löschst du sie, verschwindet auch der generierte Typ. Etwas unschön, aber ehrlich, und ESLint ist für diesen Fall im Projekt schon leiser gestellt.
4. Schau dir in der IDE an, was du gewonnen hast:
   - `data.plants[0].` vervollständigt genau die Felder deiner Query
   - Schreib einen Feldnamen absichtlich falsch. Sofort ein Fehler, kein
     `undefined` erst zur Laufzeit.
5. Jetzt der eigentliche Teil der Übung: den handgeschriebenen Typ loswerden.
   Ersetz den Inhalt von `src/types.ts` durch:

   ```ts
   import { G_GetPlants } from "./_generated-graphql-types.ts";

   export type Plant = G_GetPlants["plants"][number];
   ```

   - Von links nach rechts gelesen: das Ergebnis der Query → davon das Feld
     `plants` (ein Array) → davon ein einzelnes Element.
   - Alle Stellen, die `Plant` benutzen (`PlantCardList`, `FavoritePlantList`),
     importieren weiterhin aus `types.ts` und bleiben unverändert. Nur der
     *Inhalt* des Typs kommt jetzt woanders her.
6. Eine Sache wird dabei nicht kompilieren, und das ist die interessanteste
   Stelle der Übung: `lastWatered`.
   - Von Hand hatten wir `lastWatered?: string` geschrieben. Im Schema steht aber `lastWatered: String` **ohne Ausrufezeichen**: Das Feld ist nullable, und der generierte Typ sagt entsprechend `string | null`.
   - `null` und `undefined` sind in TypeScript zwei verschiedene Dinge. Pass die
     Property von `PlantCard` an.
   - 🧐 Der Server hat schon die ganze Zeit `null` geschickt. Warum ist das vorher niemandem aufgefallen, und was sagt das über handgepflegte Typen?
7. Nimm ein Feld aus der Query heraus, z.B. `location`, und lass den Generator
   noch einmal laufen. Was passiert?
   - Der Typ wird **enger**, und die Komponente, die `location` benutzt,
     kompiliert nicht mehr. Genau so soll es sein: Der Typ beschreibt nicht "eine
     Pflanze", sondern *das, was du angefordert hast*.
   - Mach die Änderung danach wieder rückgängig.
8. Starte zum Schluss den Watch-Modus und **lass ihn ab jetzt laufen**, in
   einem eigenen Terminal neben dem Devserver:

   ```bash
   npm run graphql:codegen:watch
   ```

   Ab jetzt regeneriert sich die Datei bei jeder Änderung an einer Query, in etwa einer Fünftelsekunde. Wer den Watch nicht laufen hat, ändert seine Query und wundert sich, dass der Typ nicht mitkommt. Das ist der zweithäufigste Stolperstein bei diesem Thema.

## Material

- GraphQL Code Generator:
  <https://the-guild.dev/graphql/codegen/docs/getting-started>
- Empfohlene Konfiguration für Apollo Client:
  <https://www.apollographql.com/docs/react/development-testing/graphql-codegen>
- Das `typescript-operations`-Plugin (erzeugt die Ergebnistypen):
  <https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-operations>
- Indizierter Zugriff auf Typen (`Typ["feld"][number]`):
  <https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html>
- Zum Nachlesen: Fragmente zur Co-Location von Datenbedarf und Komponente:
  <https://www.apollographql.com/docs/react/data/fragments>

## Hintergrund

### Was noch gut zu wissen ist

- **Die generierte Datei gehört ins Repository**, sie wird nicht ignoriert.
  Sonst kann man im Repo nichts nachschlagen, und ein frisch geklontes Projekt
  baut erst nach dem ersten Generatorlauf.
- **IntelliJ/WebStorm liest die Datei nicht von selbst neu.** Wenn die IDE
  Fehler anzeigt, die es nicht mehr gibt: Rechtsklick auf die Datei →
  *Reload from Disk*.
- Die Backend-URL steht an **drei** Stellen: `codegen.ts`, `graphql.config.yml`
  und `src/apollo-client.ts`. Wer den Port ändert, muss alle drei anfassen.

### Warum nicht die Query in eine eigene Datei?

Ginge auch, denn der Generator sucht laut `documents` auch in `.graphql`-Dateien, und die IDE-Plug-ins vervollständigen dort besonders komfortabel. Wir lassen die Queries trotzdem im TypeScript-Code, weil beim Lesen alles beieinander steht: Query, Hook und Komponente in einer Datei.
