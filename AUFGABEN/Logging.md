# Logging: Ausblick und Diskussion

Keine Übung. Ein kurzer Ausblick im Anschluss an die Error Boundary, weil `onError` dort genau der Ort ist, an dem man in einem echten Projekt loggt.

## Einstiegsfragen

- Was benutzt ihr heute für Logging und Monitoring im Frontend?
- Wo gehen bei euch Fehler verloren? (Unbehandelte Promises, Error Boundaries
  ohne Reporting, `catch`-Blöcke mit `// todo`.)
- Was fehlt euch konkret: Fehleranalyse, Performance-Daten, fachliche Events?

## Was gutes Logging ausmacht

- **Strukturiert**: JSON statt Fließtext, damit man die Logs auch auswerten kann
- **Log-Level**: error / warn / info / debug. Nicht alles ist gleich wichtig.
- **Kontext**: welche Route, welche Aktion, welche Version des Frontends?
- **Fehler nicht verschlucken**, also kein `catch (e) { /* todo */ }`
- **Keine personenbezogenen Daten in Logs.** Der häufigste Weg, sich das
  einzufangen: das ganze Formularobjekt mitloggen.

## Der React-spezifische Aufhänger

`onError` an der Error Boundary haben wir gerade schon eingebaut:

```tsx
<ErrorBoundary
  onError={(error, info) => {
    logger.error("React Error Boundary", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      componentStack: info.componentStack,
    });
  }}
>
```

`info.componentStack` ist das, was man im Log wirklich haben will: an welcher
Stelle im Komponentenbaum der Fehler entstanden ist.

## Optionen

- **Sentry** o.ä.: fertig, inklusive Source Maps, Release-Zuordnung und
  Gruppierung gleichartiger Fehler
- **Eigener Logger plus Backend-Endpunkt**: volle Kontrolle, dafür baut man
  Zuordnung und Auswertung selbst
- **`console.error` strukturiert wrappen**: das Minimum, und immer noch besser
  als nichts

## Minimales Beispiel

```ts
// src/logger.ts
const logger = {
  error(message: string, context?: Record<string, unknown>) {
    console.error(
      JSON.stringify({
        level: "error",
        message,
        ...context,
        ts: new Date().toISOString(),
      }),
    );
    // hier: fetch an den eigenen Log-Endpunkt oder Sentry.captureException(...)
  },
  warn(message: string, context?: Record<string, unknown>) {
    console.warn(
      JSON.stringify({
        level: "warn",
        message,
        ...context,
        ts: new Date().toISOString(),
      }),
    );
  },
};

export default logger;
```

## Material

- Sentry für React:
  <https://docs.sentry.io/platforms/javascript/guides/react/>
- Sentry und Error Boundaries:
  <https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary/>
