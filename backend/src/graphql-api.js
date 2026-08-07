import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { GraphQLError } from "graphql";
import { createSchema, createYoga } from "graphql-yoga";

import { samplePlants as plants, sortPlants } from "./plants.js";

dayjs.extend(customParseFormat);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Das Schema liegt als eigene Datei daneben, damit man es im Workshop
// aufmachen und zeigen kann.
const typeDefs = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf-8",
);

const isValidDate = (d) => dayjs(d, "YYYY-MM-DD", true).isValid();

// Das Enum aus dem Schema auf die Feldnamen mappen, die sortPlants kennt
const orderByFields = {
  ID: "id",
  NAME: "name",
  LOCATION: "location",
  LAST_WATERED: "lastWatered",
  WATERING_INTERVAL: "wateringInterval",
};

/**
 * Prüft die Eingaben beim Anlegen einer Pflanze.
 * Gibt eine (ggf. leere) Liste von Fehlertexten zurück.
 */
function validateCreatePlantInput({
  name,
  location,
  wateringInterval,
  lastWatered,
}) {
  const errors = [];

  if (!name) {
    errors.push("Der Name muss angegeben werden");
  } else if (name.toUpperCase() === name) {
    errors.push("Der Name darf nicht nur aus Großbuchstaben bestehen");
  }

  if (!location) {
    errors.push("Der Standort muss angegeben werden");
  }

  if (lastWatered && !isValidDate(lastWatered)) {
    errors.push(
      "Das Gieß-Datum muss ein gültiges Datum im Format 'YYYY-MM-DD' sein",
    );
  }

  if (wateringInterval < 1) {
    errors.push("Das Gieß-Intervall muss mindestens 1 Tag betragen");
  } else if (wateringInterval > 200) {
    errors.push("Das Gieß-Intervall darf höchstens 200 Tage betragen");
  }

  return errors;
}

const resolvers = {
  Query: {
    plants: (_parent, { orderBy, simulateError }) => {
      if (simulateError) {
        // Absichtlich, damit im Workshop eine Error Boundary etwas zu tun hat
        throw new GraphQLError(
          "Die Pflanzen konnten nicht geladen werden (simulateError: true) 🍂",
        );
      }

      return sortPlants(plants, orderByFields[orderBy] ?? "id");
    },

    plant: (_parent, { id }) => plants.find((p) => p.id === id) ?? null,
  },

  Mutation: {
    createPlant: (_parent, { input }) => {
      const errors = validateCreatePlantInput(input);

      if (errors.length > 0) {
        return {
          __typename: "CreatePlantError",
          msg: errors.join(", "),
        };
      }

      const newPlant = {
        id: String(plants.length + 1),
        name: input.name,
        location: input.location,
        wateringInterval: input.wateringInterval,
        lastWatered: input.lastWatered || null,
        notes: input.notes || null,
      };

      plants.push(newPlant);

      return { __typename: "CreatePlantSuccess", plant: newPlant };
    },

    waterPlant: (_parent, { id, lastWatered }) => {
      const plant = plants.find((p) => p.id === id);
      if (!plant) {
        return null;
      }

      const newLastWatered = lastWatered || dayjs().format("YYYY-MM-DD");
      if (!isValidDate(newLastWatered)) {
        throw new GraphQLError(
          `Ungültiges Datum '${newLastWatered}'. Bitte im Format 'YYYY-MM-DD' angeben`,
        );
      }

      plant.lastWatered = newLastWatered;

      return plant;
    },
  },
};

// Womit GraphiQL aufmacht. Ohne diese Angabe steht dort der Yoga-Standardtext,
// der die Oberfläche erklärt. Wir zeigen lieber gleich eine Abfrage, die zu
// unserem Schema passt.
// Achtung: Die Option heißt "query". "defaultQuery" steht zwar im TypeScript-Typ
// von graphql-yoga, wird von der ausgelieferten GraphiQL-Komponente aber nicht
// ausgewertet.
const startQuery = `# Das ist GraphiQL: hier links die Abfrage, rechts das Ergebnis.
#
#   ▶ ausführen        Play-Button oben (oder Strg-Enter / Cmd-Enter)
#   ⌨ vervollständigen Strg-Leertaste
#   📖 Schema ansehen  "Docs" links oben
#
# Probier ruhig aus, Felder wegzunehmen oder hinzuzufügen.

query AllePflanzen {
  plants {
    id
    name
    location
    wateringInterval
    lastWatered
  }
}
`;

export function setupGraphQlApi(app) {
  const yoga = createYoga({
    schema: createSchema({ typeDefs, resolvers }),
    graphqlEndpoint: "/graphql",
    // Wir setzen die CORS-Header selbst (s. server.js)
    cors: false,
    landingPage: false,
    graphiql: {
      title: "Pflanzen-API",
      query: startQuery,
    },
  });

  app.use(yoga.graphqlEndpoint, yoga);

  return yoga.graphqlEndpoint;
}
