import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import "./index.css";
import App from "./App";
import LivePaperViewer from "./LivePaperViewer";
import Docs from "./docs/Docs";
import BuilderPlaceholder from "./BuilderPlaceholder";

const { fetchPublishedLivePapers, fetchPublishedLivePaper } =
  import.meta.env.VITE_MOCK_API === "true"
    ? await import("./mocks/datastore")
    : await import("./datastore");

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    loader: async () => {
      const livepapers = await fetchPublishedLivePapers();
      return { data: livepapers };
    },
  },
  {
    path: "/builder",
    Component: BuilderPlaceholder,
  },
  {
    path: "/docs",
    Component: Docs,
  },
  {
    path: "/docs/:page",
    Component: Docs,
  },
  {
    path: "/:livePaperId",
    Component: LivePaperViewer,
    loader: async ({ params }) => {
      if (params.livePaperId) {
        const lp = await fetchPublishedLivePaper(params.livePaperId);
        return { lp: lp };
      }
    },
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
