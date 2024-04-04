import ReactDOM from "react-dom";
import React from "react";
import { App } from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const qc = new QueryClient();

export function render() {
  ReactDOM.render(
    <React.StrictMode>
      <QueryClientProvider client={qc}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById("root"),
  );
}
