import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { routes } from "./routes";

const qc = new QueryClient({ defaultOptions: { queries: {} } });
const router = createHashRouter(routes);

export function render() {
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={qc}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
