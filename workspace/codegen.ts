import type { CodegenConfig } from "@graphql-codegen/cli";

// Konfiguration für den GraphQL Code Generator.
//
// Der Generator liest das Schema vom laufenden Backend (das Backend muss
// also gestartet sein!), sucht im Quelltext nach GraphQL-Operationen und
// schreibt daraus eine TypeScript-Datei mit passenden Typen.
//
// Eingerichtet wird der Generator im Workshop nicht, wir benutzen ihn nur.
const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:7200/graphql",
  // Die generierte Datei selbst nehmen wir aus: Sie enthält keine Operationen,
  // und wenn dort einmal etwas nicht kompiliert, kann der Generator sonst
  // nicht einmal mehr durchlaufen, um es zu reparieren.
  documents: ["src/**/*.{ts,tsx,graphql}", "!src/_generated*"],
  // Normalerweise steht das auf "false". Hier auf "true", weil es zu Beginn
  // des Workshops noch gar keine Query gibt und der Generator sonst mit
  // einem Fehler abbricht.
  ignoreNoDocuments: true,
  generates: {
    // https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-operations
    "./src/_generated-graphql-types.ts": {
      config: {
        // https://www.apollographql.com/docs/react/development-testing/graphql-codegen#recommended-starter-configuration
        // Apollo Client fragt __typename immer mit ab
        nonOptionalTypename: true,
        // ... aber nicht für die Root-Typen (Query, Mutation)
        skipTypeNameForRoot: true,
        inlineFragmentTypes: "combine",

        // ------------- Geschmackssache, für Apollo nicht nötig -------------
        typesPrefix: "G_",
        omitOperationSuffix: true,
        printFieldsOnNewLines: true,
        enumsAsTypes: true,
      },
      // "typescript-operations" erzeugt die Input- und Enum-Typen, die unsere
      // Operationen benutzen, selbst. Das "typescript"-Plugin steht deshalb
      // nicht daneben: Zusammen stünde jeder dieser Typen zweimal in der Datei
      // ("Duplicate identifier").
      plugins: ["typescript-operations", "typed-document-node"],
    },
  },
};

export default config;
