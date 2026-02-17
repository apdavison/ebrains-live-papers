import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import "./index.css";
import App from "./App";
import BlueNaaS from "./BlueNaaS";
import LivePaperViewer from "./LivePaperViewer";

const { fetchPublishedLivePapers, fetchPublishedLivePaper } =
  import.meta.env.VITE_MOCK_API === "true"
    ? await import("./mocks/datastore")
    : await import("./datastore");

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    loader: async () => {
      let livepapers = await fetchPublishedLivePapers();
      return { data: livepapers };
    },
  },
  {
    path: "/bluenaas-tmp",
    Component: BlueNaaS
  },
  {
    path: "/:livePaperId",
    Component: LivePaperViewer,
    loader: async ({ params }) => {
      if (params.livePaperId) {
        let lp = await fetchPublishedLivePaper(params.livePaperId);
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
