import type { RouteObject } from "react-router-dom";
import { TagPage } from "./TagPage";
import { Layout } from "./Layout";
import { MainPage } from "./MainPage";
import { ErrorPage } from "./ErrorPage";
import { TagCategoryPage } from "./TagCategoryPage";
import { TagTagPage } from "./TagTagPage";

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <MainPage /> },
      {
        path: "tag/",
        element: <TagPage />,
      },
      {
        path: "tag/category/:id",
        element: <TagCategoryPage />,
      },
      {
        path: "tag/tag/:id",
        element: <TagTagPage />,
      },
    ],
  },
];
