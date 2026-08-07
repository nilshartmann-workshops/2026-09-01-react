import express from "express";

import { setupGraphQlApi } from "./graphql-api.js";

const app = express();

app.use((_, res, next) => {
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET,PUT,POST,PATCH,DELETE",
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    // 'slowdown' wird vom Slowdown-Link im Frontend gesetzt. Ohne diesen
    // Eintrag scheitert der CORS-Preflight und der Request kommt nie an.
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, slowdown",
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Preflight (OPTIONS) direkt beantworten. Für /graphql ist das nötig, weil
// der Browser wegen des 'slowdown'-Headers vorher anfragt.
app.options(/.*/, (_req, res) => res.sendStatus(204));

app.use((req, _res, next) => {
  // Verzögerung pro Operation: Der Slowdown-Link im Frontend schickt die
  // gewünschte Wartezeit in Millisekunden als Header mit
  // (siehe workspace/src/slowdown-link.ts).
  const fromHeader = parseInt(req.headers["slowdown"]);
  if (fromHeader > 0) {
    console.log(`Slow down ${fromHeader}ms (slowdown-Header)`);
    return setTimeout(next, fromHeader);
  }

  next();
});

const graphqlEndpoint = setupGraphQlApi(app);

const port = process.env.SERVER_PORT || 7200;

app.listen(port, () => {
  console.log(`
    📞    Plant API Server listening on port ${port}
    👉    GraphQL:  http://localhost:${port}${graphqlEndpoint}
`);
});
