# Exkurs: Union-Typen und Type Narrowing

## Dateien

Keine, in diesem Schritt wird nichts programmiert. Wir schauen uns an, was beim Anlegen der Pflanze schon entstanden ist.

## Aufgabe

Kein Bauen, sondern Verstehen: Warum weiß TypeScript in der einen Hälfte unserer `if`-Abfrage von `plant` und in der anderen von `msg`? Das dahinterliegende Muster heißt **Discriminated Union** und begegnet einem in TypeScript ständig, nicht nur bei GraphQL.

## Der einfache Fall zuerst

Eine Union ist ein "oder" für Typen. Das kennst du schon, ohne dass es je so
genannt wurde:

```ts
type Plant = {
  lastWatered?: string;
};
```

Das `?` ist nichts anderes als eine Kurzschreibweise für:

```ts
lastWatered: string | undefined;
```

Der Wert ist **entweder** ein `string` **oder** `undefined`. Und deshalb erlaubt TypeScript auch nicht, einfach `lastWatered.length` zu schreiben, denn auf `undefined` gibt es kein `.length`. Erst nach einer Prüfung ist es erlaubt:

```ts
if (lastWatered) {
  lastWatered.length; // hier ist es sicher ein string
}
```

Diesen Vorgang nennt man **Type Narrowing**: TypeScript verfolgt den
Kontrollfluss und weiß innerhalb des `if`, dass ein Fall ausgeschlossen ist.

## Der Fall aus unserer Mutation

Unsere Union ist derselbe Gedanke, nur mit Objekten statt mit `undefined`. Aus
dem GraphQL-Schema:

```graphql
union CreatePlantPayload = CreatePlantSuccess | CreatePlantError
```

Daraus macht der Code-Generator (leicht gekürzt):

```ts
type G_CreatePlant = {
  createPlant:
    | { __typename: "CreatePlantError"; msg: string }
    | { __typename: "CreatePlantSuccess"; plant: { id: string; name: string } };
};
```

Mach ruhig `src/_generated-graphql-types.ts` daneben auf und such `G_CreatePlant`, dort steht dasselbe, nur ausführlicher. Auf die Reihenfolge der beiden Varianten musst du dabei nicht achten: Eine Union ist ein "oder", keine Abfolge.

Interessant ist das Feld `__typename`. Es ist in beiden Varianten vorhanden, aber es hat jeweils einen **Literal-Typ**: nicht `string`, sondern genau der eine mögliche Wert. Damit ist es die **Diskriminante**, also das Feld, an dem man die beiden Fälle auseinanderhalten kann. Und genau deshalb funktioniert das hier:

```ts
if (result.__typename === "CreatePlantSuccess") {
  result.plant; // ✅ TypeScript weiß: das ist der Erfolgsfall
  result.msg; //   ❌ Fehler: gibt es hier nicht
} else {
  result.msg; //   ✅ jetzt bleibt nur noch der Fehlerfall übrig
}
```

Probier es in deiner IDE aus: Schreib in den einen Zweig den Zugriff aus dem
anderen und schau dir die Fehlermeldung an.

> **Damit das funktioniert, muss `__typename` im generierten Typ Pflicht sein.**
> Bei uns steht dafür `nonOptionalTypename: true` in der `codegen.ts`. Ohne die
> Option wäre der Typ `"CreatePlantSuccess" | undefined`, und das Narrowing
> ginge nicht mehr auf. Solche Kleinigkeiten machen bei Codegen-Konfigurationen
> den Unterschied.

## Alle Fälle behandeln

Bei zwei Fällen tut es ein `if`/`else`. Bei mehreren nimmt man ein `switch`, und dann stellt sich die Frage, wie man merkt, dass man einen Fall vergessen hat. Der Trick heißt **exhaustiveness check**:

```ts
switch (result.__typename) {
  case "CreatePlantSuccess":
    return result.plant.name;
  case "CreatePlantError":
    return result.msg;
  default: {
    // 💬 Hier kommt der Code nur an, wenn alle Fälle behandelt sind.
    //    Dann, und nur dann, ist `result` vom Typ `never`.
    const exhaustive: never = result;
    return exhaustive;
  }
}
```

Der Wert `never` bedeutet "diesen Wert kann es nicht geben". Kommt im Schema
später ein dritter Fall dazu, passt die Zuweisung nicht mehr, und du bekommst
einen **Compilerfehler an genau der Stelle, die du anpassen musst**. Das ist der
Unterschied zwischen "es fällt beim nächsten Deployment auf" und "es fällt beim
Übersetzen auf".

- 🧐 Probier es aus: Kommentier einen der beiden `case`-Zweige weg. Was sagt
  TypeScript, und wo?

## Wo dir das Muster sonst begegnet

Discriminated Unions sind eines der Muster, die man einmal lernt und dann
überall sieht:

- **Ergebnistypen statt Exceptions**: `{ status: "ok", data } | { status: "error", message }`.
  Genau das macht unser GraphQL-Schema.
- **Redux-Actions**: `{ type: "ADD_TODO", ... } | { type: "REMOVE_TODO", ... }`,
  und der Reducer ist ein `switch` über `type`.
- **Zustandsautomaten**: `{ state: "idle" } | { state: "loading" } | { state: "done", result }`.
  Der schöne Effekt: Es ist dann *unmöglich*, gleichzeitig "loading" zu sein und
  ein Ergebnis zu haben. Der Typ verbietet unsinnige Kombinationen, statt sie
  nur unwahrscheinlich zu machen.
- **React-Props**: eine Komponente, die entweder `href` (dann ein Link) oder
  `onClick` (dann ein Button) bekommt, aber nie beides.

## Material

- Narrowing im TypeScript Handbook:
  <https://www.typescriptlang.org/docs/handbook/2/narrowing.html>
- Discriminated Unions:
  <https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions>
- Der `never`-Typ und Exhaustiveness:
  <https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking>
- Union-Typen in GraphQL: <https://graphql.org/learn/schema/#union-types>

## Hintergrund

### Warum das Schema den Fehler überhaupt als Rückgabewert modelliert

Man könnte einen Validierungsfehler auch als GraphQL-Fehler werfen, dann käme er im `errors`-Array an, so wie bei der Error Boundary. Das tut man aber üblicherweise nur für *technische* Fehler: Server kaputt, nicht angemeldet, Feld gibt es nicht.

Ein abgelehntes Formular ist kein technischer Fehler, sondern ein völlig normales Ergebnis der Operation. Wenn es als regulärer Rückgabewert im Typsystem steht, kann der Client ihn nicht übersehen, denn der Compiler zwingt ihn, beide Fälle zu behandeln. Bei einem geworfenen Fehler wäre das nur eine Konvention und eine Zeile Dokumentation.

Das ist derselbe Gedanke wie bei `Result`-Typen in Rust oder `Either` in
funktionalen Sprachen: **Erwartbare Fehlschläge gehören in den Rückgabewert,
unerwartete in den Fehlerkanal.**
