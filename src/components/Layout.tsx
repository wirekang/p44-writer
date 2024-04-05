import { Outlet, useLocation } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Suspense } from "react";

export function Layout() {
  const location = useLocation();
  return (
    <div>
      <div>
        {location.pathname}
        {location.search}
        {location.hash}
      </div>
      <NavBar />
      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
}
