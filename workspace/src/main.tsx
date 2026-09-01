import "./index.css";
import "./setup-dayjs.ts";

import { ApolloProvider } from "@apollo/client/react";
import { createRoot } from "react-dom/client";

import { apolloClient } from "./apollo-client.ts";
import App from "./components/App.tsx";

createRoot(document.getElementById("root")!).render(
    <App />
);
