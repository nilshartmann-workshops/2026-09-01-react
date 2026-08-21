# Speichern mit einer Mutation

## Dateien

- `src/components/PlantForm.tsx`
- `src/_generated-graphql-types.ts` (wird neu generiert)

## Vorbereitung

Backend läuft, und der Codegen-Watch läuft auch. Sonst kennt TypeScript die neue Mutation nicht.

## Aufgabe

Jetzt kommt zusammen, was wir bisher getrennt gebaut haben: Das Formular
schickt seine Daten per GraphQL-Mutation an den Server, behandelt Erfolg und
Fehler und sorgt dafür, dass die Pflanzenliste danach aktuell ist.

## Schritte

1. Schreib die Mutation, oben in `PlantForm.tsx`:

   ```tsx
   const CREATE_PLANT_MUTATION = gql`
     mutation CreatePlant($input: CreatePlantInput!) {
       createPlant(input: $input) {
         ... on CreatePlantSuccess {
           plant {
             id
             name
             # ... die übrigen Felder
           }
         }
         ... on CreatePlantError {
           msg
         }
       }
     }
   `;
   ```

   - Die Inline-Fragmente kennst du aus dem GraphiQL-Rundgang, hier stehen sie zum ersten Mal im Anwendungscode. Sie sind **Pflicht**, weil `createPlant` eine Union zurückgibt.
   - `$input` ist unsere erste **Variable**. Bis hierhin kamen alle Operationen
     ohne aus. Der Typ (`CreatePlantInput!`) steht im Schema, das
     IDE-Plug-in vervollständigt ihn dir.
   - Nach dem Speichern der Datei erzeugt der Watch-Modus ein
     `CreatePlantDocument` und den passenden Ergebnistyp. Schau kurz ins Generat:
     Der Ergebnistyp ist jetzt eine **Union aus zwei Objekttypen**.
2. Häng die Mutation in die Komponente:

   ```tsx
   import { useMutation } from "@apollo/client/react";

   const [createPlant, createPlantResult] = useMutation(CreatePlantDocument, {
     refetchQueries: [{ query: GetPlantsDocument }],
   });
   ```

   - `useMutation` gibt ein **Array** zurück: die Funktion zum Auslösen, dann ein Objekt mit dem Zustand. Das ist anders als bei `useSuspenseQuery`, und zwar aus gutem Grund: Eine Mutation läuft nicht beim Rendern los, sondern wenn jemand einen Knopf drückt. Deshalb geht sie nicht deklarativ.
   - Das zweite Element kannst du auch gleich destrukturieren
     (`[createPlant, { loading }]`). Wir lassen es hier bewusst stehen: So sieht
     man an `createPlantResult.loading`, woher der Wert kommt.
   - `refetchQueries` ist der einfachste Weg, die Liste zu aktualisieren: Nach
     der Mutation lädt Apollo die genannten Queries noch einmal.
   - ⚠️ **Auf die Schreibweise achten: `{ query: GetPlantsDocument }`, nicht einfach `GetPlantsDocument`.** Beides kompiliert, aber nur das eine funktioniert bei uns. Ein nacktes Document löst Apollo zum *Namen* der Operation auf und aktualisiert damit nur Queries, die gerade **aktiv** sind, die also von einer gerade gerenderten Komponente benutzt werden. Unsere Liste ist das nicht: Während du im Formular stehst, liegt sie in einem anderen Tab und ist ausgehängt. Auf der Konsole steht dann *"Unknown query named GetPlants requested in refetchQueries options.include array"*, und die Liste bleibt beim alten Stand.
3. Löse die Mutation im `onSubmit` des Formulars aus. Die Formularwerte passen
   direkt in den Input:

   ```tsx
   const { data } = await createPlant({ variables: { input: value } });
   ```

4. Behandle das Ergebnis. Hier verzweigt es auf `__typename`:

   ```tsx
   const result = data?.createPlant;
   if (result?.__typename === "CreatePlantSuccess") {
     // Erfolgsmeldung anzeigen, Formular zurücksetzen
   } else {
     // result.msg als Fehlermeldung anzeigen
   }
   ```

   - Schau in der IDE nach: Im `if`-Zweig kennt TypeScript `result.plant`, im
     `else`-Zweig `result.msg`. Genau dafür ist die Union da.
   - Für die Meldungen gibt es die CSS-Klassen `success-message` und
     `error-message`. Zwei `useState` reichen dafür.
   - Die Server-Fehlermeldung gehört **über das Formular**, nicht an ein Feld.
     Sie ist ein einzelner Text und sagt nicht, welches Feld gemeint war.
   - Beides steht in `PlantForm.tsx` und nicht in einer der beiden Feldgruppen:
     Es gehört zum Formular als Ganzem.
   - `formApi.reset()` steht schon da. Es rutscht jetzt nur in den
     Erfolgszweig, denn nach einem abgelehnten Namen sollen die Eingaben
     stehen bleiben.
5. Probier den Erfolgsfall aus: Pflanze anlegen, dann auf den Tab "Pflanzen"
   wechseln. Steht sie in der Liste?
   - Wenn nicht: Schau in die Konsole und noch einmal auf die Schreibweise von
     `refetchQueries` in Schritt 2.
   - 🧐 Fällt die Liste dabei noch einmal in den Suspense-Fallback? Warum
     (nicht)?
6. Und jetzt der Fehlerfall: Leg eine Pflanze an, deren Name **nur aus
   Großbuchstaben** besteht (z.B. `MONSTERA`).
   - zod lässt das durch, denn für unser Schema ist es ein gültiger, nicht leerer String.
   - Das Backend lehnt es ab, und der Text landet in `CreatePlantError.msg`.
   - Das ist der Beleg für einen Satz, den man sich merken darf:
     **Client-Validierung ist Komfort, Server-Validierung ist Wahrheit.** Ein
     Client kann man abschalten, den Server nicht.
   - 🧐 Schau dabei mal in den Netzwerk-Tab: Obwohl nichts angelegt wurde, geht hinterher trotzdem ein `GetPlants` raus. Woran liegt das, und wo müsste man ansetzen, damit die Liste nur im Erfolgsfall neu geladen wird? Die Antwort steht unten im Hintergrund. Schlimm ist es nicht, es ist nur ein Request zu viel.
7. Setz den Absende-Button auf `disabled`, solange die Mutation läuft, dafür ist `createPlantResult.loading` da.
   - Sehen wirst du das nur, wenn das Speichern lange genug dauert. Trag dafür kurz eine Verzögerung in `src/demo-config.ts` ein, diesmal bei `CreatePlant`.
8. 🧐 Optional (wenn du noch Zeit hast): Was passiert eigentlich, wenn das Backend gar nicht läuft? Stopp es und schick das Formular ab. Wo landet der Fehler, und warum **nicht** in der Error Boundary?

## Material

- `useMutation`:
  <https://www.apollographql.com/docs/react/data/mutations>
- Refetching nach einer Mutation:
  <https://www.apollographql.com/docs/react/data/refetching>
- Variablen in GraphQL: <https://graphql.org/learn/queries/#variables>
- Union-Typen und Inline-Fragmente in GraphQL:
  <https://graphql.org/learn/schema/#union-types>

## Hintergrund

### Warum auch im Fehlerfall nachgeladen wird

`refetchQueries` ist eine Option von `useMutation` und weiß nichts von unserer Auswertung: Sie greift, sobald die Mutation *technisch* durchgelaufen ist. Unser abgelehnter Pflanzenname ist aber kein technischer Fehler, sondern ein regulärer Rückgabewert, und für Apollo hat alles geklappt.

Wer das ändern will, gibt statt der Liste eine **Funktion** an. Sie bekommt das Ergebnis der Mutation und entscheidet:

```tsx
const [createPlant, createPlantResult] = useMutation(CreatePlantDocument, {
  refetchQueries: (result) =>
    result.data?.createPlant.__typename === "CreatePlantSuccess"
      ? [{ query: GetPlantsDocument }]
      : [],
});
```

Dieselbe Verzweigung wie in `onSubmit`, nur an einer anderen Stelle. Wir lassen es im Workshop bei der einfachen Liste: Ein Request zu viel im Fehlerfall tut niemandem weh, und die Fassung oben ist die, die man in jedem Beispiel findet.

### Warum der Fehler nicht in der Error Boundary landet

Die Error Boundary fängt Fehler **beim Rendern**. Unsere Mutation läuft in einem Event-Handler, also lange nachdem gerendert wurde, und dort kommt React gar nicht mehr vorbei. Deshalb behandeln wir den Fehler hier von Hand, mit `try`/`catch` und einer Meldung im Formular.

Es sind also drei verschiedene Arten von Fehlern, die an drei verschiedenen
Stellen landen:

| Fehler | Wo er ankommt |
|---|---|
| Eingabe verstößt gegen unser zod-Schema | am Feld, ohne Server |
| Server lehnt die Eingabe fachlich ab | `CreatePlantError.msg`, über dem Formular |
| Query beim Rendern schlägt fehl | Error Boundary |
