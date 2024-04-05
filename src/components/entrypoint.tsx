import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const qc = new QueryClient({ defaultOptions: { queries: {} } });

export function render() {
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={qc}>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
