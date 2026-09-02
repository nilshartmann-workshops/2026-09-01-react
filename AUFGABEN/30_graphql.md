# GraphQL Abfragen (Grundlagen)

## Dateien

Keine, in diesem Schritt wird nichts programmiert.


## Vorbereitung

Bitte starte als erstes das Backend.

**Entweder** ins `backend`-Verzeichnis gehen, und dort starten:

```bash
cd backend
npm start
```

**oder** im `workspace`-Verzeichnis:
```bash
# Workspace

npm run backend
```

Danach ist GraphiQL unter <http://localhost:7200/graphql> erreichbar. 
GraphiQL ist eine eine Art "GraphQL Explorer", eine Webanwendung, in der 
du Queries schreiben und ausführen kannst, ohne eigene Anwendung (vergleichbar
z.B. mit Datenbank-Explorern). 
GraphiQL ist der prominenteste GraphQL-Explorer, aber es gibt auch andere und
auch z.B. mit Postman lassen sich GraphQL-Requests ausführen.

**Ab jetzt bitte das Backend für den Rest des Workshops laufen lassen, nicht beenden!** 

## Aufgabe

Mach dich mit unserer GraphQL API vertraut

## Schritte

### 1. Das Schema anschauen

In GraphiQL gibt es rechts oben den Docs-/Schema-Explorer. Darin findest du
alles, was der Server kann. Bei uns ist das überschaubar:

| | |
|---|---|
| `plants(orderBy, simulateError)` | liefert alle Pflanzen |
| `plant(id)` | liefert eine einzelne Pflanze, oder `null` |
| `createPlant(input)` | neue Pflanze anlegen |
| `waterPlant(id, lastWatered)` | Gießdatum setzen |

Die ersten beiden sind **Queries** (lesen), die anderen beiden **Mutations** (schreiben). Das ist die einzige Unterscheidung, die GraphQL macht: Es gibt kein `GET`/`POST`/`PUT`, alles geht als `POST` an *einen* Endpunkt (`http://localhost:7200/graphql`).

Dasselbe Schema liegt beim Backend auch als Datei: `backend/src/schema.graphql`.

### 2. Eine erste Query schreiben

Tipp den folgenden Text in die linke Hälfte von GraphiQL und führ ihn mit dem
▶-Knopf aus:

```graphql
query {
  plants {
    name
  }
}
```

- Ergänze `location` und führ noch einmal aus. **Du bekommst genau das, was du anforderst**, nicht mehr und nicht weniger. Das ist der zentrale Unterschied zu einer REST-API, die immer dasselbe Objekt liefert.
- Fordere ein Feld an, das es nicht gibt (z.B. `farbe`). 
- Probier die Autovervollständigung aus (Control/Strg+Leertaste). GraphiQL kennt das
  Schema und weiß deshalb an jeder Stelle, was erlaubt ist.

### 3. Argumente

```graphql
query {
  plants(orderBy: NAME) {
    name
    location
  }
}
```

- Ohne `orderBy` sortiert der Server nach `ID`, dem Default aus dem Schema.
- Probier auch `plant(id: "1")` und ein `plant(id: "999")`. Was kommt bei einer
  unbekannten Id zurück?


### 5. Optional (wenn du noch Zeit hast): Probier eigene Queries aus

Beispiele:
- Alle Pflanzen nach Standort sortiert, mit Gießintervall
- Eine einzelne Pflanze über ihre `id`, mit allen Feldern
- `plants(simulateError: true)`, den brauchen wir später wieder
- Eine Pflanze gießen: `waterPlant(id: "1")` und danach `plant(id: "1")`
  abfragen. Die Daten liegen nur im Hauptspeicher des Servers: Nach einem
  Neustart ist die Änderung wieder weg.

## Material

- Queries und Mutations in GraphQL: <https://graphql.org/learn/queries/>
- Apollo Client Doku: <https://www.apollographql.com/docs/react>
- **IDE-Plug-ins.** Beide lesen unsere `graphql.config.yml` und geben dir damit
  Autovervollständigung und Validierung gegen unser Schema, auch im TypeScript-Code:
  - IntelliJ/WebStorm: <https://plugins.jetbrains.com/plugin/8097-graphql>
  - VS Code: <https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql>
- **Apollo Client DevTools** für Chrome/Firefox, sie zeigen die laufenden
  Operationen und den Cache-Inhalt:
  <https://www.apollographql.com/docs/react/development-testing/developer-tooling#apollo-client-devtools>

## Hintergrund

### Was schon fertig in der Anwendung liegt

Die Apollo-Konfiguration ist vorgegeben, wir richten sie im Workshop nicht
selbst ein. Wichtige Dateien:

- **`src/apollo-client.ts`**, der Client: Zentrales Objekt mit der GraphQL-Konfiguration
 (bei uns nur Backend URL und Cache)
- **`src/main.tsx`**, der `<ApolloProvider>` um die Anwendung. Das ist derselbe
  Context-Mechanismus, den wir vorher selbst gebaut haben. Dieser Context stellt den 
  GraphQL Client den GraphQL Komponenten und Funktionen, die wir uns gleich ansehen,
  bereit.
- **`src/slowdown-link.ts` und `src/demo-config.ts`**: nur für den Workshop/die Demos, 
  um verschiedene Szenarien testen zu können.

### Wir arbeiten mit Apollo Client 4

Das ist wichtig zu wissen, sobald du anfängst zu googeln: **Oft findet man in Artikel,
Tutorials etc in Internet noch Apollo Client 3**, und die Importpfade haben sich
geändert.

Merkregel: **Alles, was mit React zu tun hat, kommt aus `@apollo/client/react`**, also `ApolloProvider`, `useSuspenseQuery`, `useMutation` und `useApolloClient`. Alles andere (`gql`, `ApolloClient`, `InMemoryCache`, `HttpLink`) kommt unverändert aus `@apollo/client`.

Migrationsleitfaden (dort steht auch, was sonst noch anders ist):
<https://www.apollographql.com/docs/react/migration/4.0>
