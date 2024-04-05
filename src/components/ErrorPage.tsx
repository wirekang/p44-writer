import { useRouteError } from "react-router-dom";
import { NavBar } from "./NavBar";

export function ErrorPage() {
  const e = useRouteError() as any;
  return (
    <div>
      <NavBar />
      ERROR
      <pre>{JSON.stringify(e, null, 2)}</pre>
    </div>
  );
}
