// https://www.apollographql.com/docs/react/api/link/apollo-link-context
import { SetContextLink } from "@apollo/client/link/context";

import { delayConfig } from "./demo-config";

/**
 * Ein Apollo-Link, der jede GraphQL-Operation auf der Konsole protokolliert
 * und sie künstlich verzögert, wenn sie in `delayConfig` eingetragen ist.
 */
export function createSlowdownLink() {
  return new SetContextLink((currentContext, { operationName, variables }) => {
    console.log("GraphQL-Operation:", operationName, variables);

    if (!operationName) {
      return currentContext;
    }

    const slowdown = delayConfig[operationName];
    if (!slowdown) {
      return currentContext;
    }

    console.info(
      `GraphQL-Operation '${operationName}' wird um ${slowdown}ms verzögert`,
    );

    return {
      ...currentContext,
      headers: {
        ...currentContext.headers,
        slowdown,
      },
    };
  });
}
