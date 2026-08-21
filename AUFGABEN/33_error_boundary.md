# Error Boundaries

## Dateien

- `src/components/PlantErrorBoundary.tsx` (anlegen!)
- `src/components/App.tsx`

## Vorbereitung

Du brauchst das Terminal, in dem das **Backend** läuft, denn wir schalten es zwischendurch ab. Und die Browser-Konsole samt Netzwerk-Tab.

## Aufgabe

Den Ladezustand haben wir vorhin ausgelagert, jetzt kommt der Fehlerfall dran. Du provozierst einen Fehler, baust eine Error Boundary, hängst sie ein und schaust dir an, was beim erneuten Versuch passiert (und was nicht).

## Schritte

1. Provozier erst einmal den Fehler, und zwar auf die realistischste Art, die es
   gibt: **Stopp das Backend** (im Backend-Terminal `Strg`+`C`). Lad die Seite
   im Browser neu.
   - Ergebnis: ein weißer Bildschirm. In der Konsole steht der Fehler, in der Anwendung steht nichts mehr, auch die Tab-Leiste ist weg.
   - Genau das macht React im Fehlerfall: Findet sich niemand, der den Fehler auffängt, wird der **komplette** Komponentenbaum abgeräumt. Das ist Absicht, denn eine halb kaputte Oberfläche ist gefährlicher als gar keine.
2. Leg `src/components/PlantErrorBoundary.tsx` an. Eine eigene Error-Boundary-
   **Klasse** musst du nicht schreiben: Die Komponente `ErrorBoundary` kommt aus
   der Bibliothek `react-error-boundary` und ist schon installiert.
   - Deine Komponente nimmt `children` entgegen und gibt sie in eine
     `<ErrorBoundary>` verpackt zurück.
   - `fallbackRender` ist eine Funktion und liefert das, was anstelle der
     kaputten Komponenten angezeigt wird. Bau darin eine Überschrift, die
     Fehlermeldung und einen Button "Erneut versuchen" (CSS-Klasse
     `ErrorFallback` fürs `div`). Die Funktion bekommt ein Objekt mit `error` und `resetErrorBoundary`, und der Button ruft fürs Erste `resetErrorBoundary` auf. (In Schritt 6 stellt sich heraus, dass das noch nicht reicht.)
   - `onError` bekommt den Fehler ebenfalls und ist der Ort, an dem in einem
     echten Projekt geloggt wird. Fürs Erste ein `console.error`.
3. Schreib eine Hilfsfunktion `errorMessage(error: unknown)`, die aus dem
   gefangenen Fehler einen anzeigbaren Text macht.
   - Der Parameter ist **`unknown`**, nicht `Error`: In JavaScript kann man
     alles werfen, und `react-error-boundary` ist da ehrlich.
   - Ein Fehler, den der Server im `errors`-Array einer GraphQL-Antwort
     geliefert hat, kommt als `CombinedGraphQLErrors` an (Import aus
     `@apollo/client/errors`) und hat ein Array `errors`. Der `ApolloError` aus
     Apollo Client 3, den du beim Googeln findest, existiert nicht mehr.
   - Ist es ein `Error`, nimm `error.message`. Sonst `String(error)`.
4. Häng die Boundary in `App` um die Pflanzenliste. **Reihenfolge merken:
   `<PlantErrorBoundary>` außen, `<Suspense>` innen.**
   - Backend ist immer noch aus, Seite neu laden: Statt des weißen Bildschirms steht jetzt die Fehlermeldung da, und die Tab-Leiste ist noch da.
5. Jetzt **starte das Backend wieder** (`npm start` im `backend`-Verzeichnis)
   und klick auf "Erneut versuchen", ohne die Seite neu zu laden.
   - Es passiert **nichts**. Der Fehler steht immer noch da, obwohl der Server
     längst wieder läuft. Schau in den Netzwerk-Tab: Es geht nicht einmal ein
     Request raus.
   - Der Grund: `resetErrorBoundary()` setzt nur die *Boundary* zurück. Danach
     rendert React die Kinder erneut, Apollo liefert das gemerkte
     Fehlerergebnis sofort wieder, und die Boundary fängt es wieder auf. Der
     Button sieht kaputt aus, ist es aber nicht.
6. Repariere den Button: **Erst neu laden, dann zurücksetzen.** Hol dir mit
   `useApolloClient()` den Client und mach aus dem `onClick` eine asynchrone
   Funktion:

   ```
   erst  await client.refetchQueries({ include: "active" })
   dann  props.resetErrorBoundary()
   ```

   - Jetzt klappt es beim ersten Klick.
   - 🧐 Warum reicht es nicht, den Refetch *im* `onReset` der `ErrorBoundary` anzustoßen? Probier es ruhig aus: Die Boundary setzt sich sofort zurück, die Kinder rendern, und Apollo wirft den alten Fehler ein zweites Mal, denn die Antwort auf den Refetch kommt erst danach. Beim *zweiten* Klick funktioniert es dann, was die Fehlersuche nicht leichter macht.
   - Pack den `await` in ein `try`/`catch`: Läuft das Backend immer noch nicht,
     soll die Meldung einfach stehen bleiben.
7. 🧐 Optional (wenn du noch Zeit hast): Wo würdest du die Boundary in einer größeren Anwendung platzieren, eine ganz außen oder viele kleine? Was gewinnt und was verliert man jeweils?

## Material

- Error Boundaries in React:
  <https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary>
  (du musst keine eigene Klasse schreiben, wir nehmen die Bibliothek)
- `react-error-boundary`: <https://github.com/bvaughn/react-error-boundary>
- Fehlertypen in Apollo Client 4:
  <https://www.apollographql.com/docs/react/api/errors>
- Was sich von Apollo Client 3 auf 4 geändert hat:
  <https://www.apollographql.com/docs/react/migration/4.0>

## Hintergrund

### Zwei Zustände, zwei Orte

Beim deklarativen Ansatz behandelt die ladende Komponente weder Laden noch Fehler. Beides wandert nach oben, an zwei verschiedene Stellen: `<Suspense>` und `<ErrorBoundary>`. Das ist der eigentliche Gewinn: Die Komponente, die die Daten braucht, enthält nur noch den Fall, der sie interessiert.

Der Preis ist die Stelle aus Schritt 5 und 6: Zwischen der Boundary und dem Server sitzt ein Cache, und "zurücksetzen" heißt deshalb nicht automatisch "neu laden".

### Was Error Boundaries *nicht* fangen

- Fehler in Event-Handlern (`onClick`), die laufen nicht während des Renderns
- Fehler in `setTimeout` oder in asynchronem Code
- Fehler beim Rendern auf dem Server

Für diese Fälle braucht man klassisches `try`/`catch` oder, bei Mutationen, den Fehlerzustand, den `useMutation` mitliefert.
