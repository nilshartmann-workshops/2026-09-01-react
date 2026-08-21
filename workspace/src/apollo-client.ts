import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

import { createSlowdownLink } from "./slowdown-link";

// Die Verbindung zum Backend.
//
// ⚠️ Achtung: Die Backend-URL steht an drei Stellen: hier, in codegen.ts und in
// graphql.config.yml. Wenn du den Port änderst, musst du alle drei anpassen.
const httpLink = new HttpLink({ uri: "http://localhost:7200/graphql" });

// Der Apollo Client für unsere Anwendung, für den Workshop so einfach
// konfiguriert wie möglich.
export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: createSlowdownLink().concat(httpLink),
});
