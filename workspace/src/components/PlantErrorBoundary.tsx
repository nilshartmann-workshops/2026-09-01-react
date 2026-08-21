import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { useApolloClient } from "@apollo/client/react";
import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

// 💬 Erzählen: `unknown`, weil man in JavaScript alles werfen darf. Fehler aus
//    dem errors-Array kommen als CombinedGraphQLErrors an.
function errorMessage(error: unknown) {
  if (error instanceof CombinedGraphQLErrors) {
    return error.errors.map((e) => e.message).join(", ");
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

type PlantErrorBoundaryProps = {
  children: ReactNode;
};

export default function PlantErrorBoundary({
  children,
}: PlantErrorBoundaryProps) {
  const client = useApolloClient();

  return (
    <ErrorBoundary
      // 💬 Erzählen: hier landet man im echten Projekt beim Logging
      onError={(error) => {
        console.error("[PlantErrorBoundary]", error);
      }}
      fallbackRender={(props) => (
        <div className={"ErrorFallback"}>
          <h2>Das hat leider nicht geklappt 🥀</h2>
          <p>{errorMessage(props.error)}</p>
          {/* 💬 Der Fallstrick: erst neu laden, *dann* zurücksetzen. Zeigen:
              nur resetErrorBoundary() aufrufen, dann passiert nichts. */}
          <button
            type={"button"}
            onClick={async () => {
              try {
                await client.refetchQueries({ include: "active" });
              } catch {
                // Klappt es immer noch nicht, bleibt die Meldung eben stehen
              }
              props.resetErrorBoundary();
            }}
          >
            Erneut versuchen
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
