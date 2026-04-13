import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import initAuth from "./auth";
import { ContextMainProvider } from "./ContextMain";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BulkEntryWizard from "./BulkEntryWizard";

function initLoad() {
  // to avoid authentication when opening BulkEntryWizard
  console.log(window.location.pathname);
  if (window.location.pathname.includes("BulkEntryWizard")) {
    renderApp(null);
  } else if (import.meta.env.DEV && import.meta.env.VITE_DEV_TOKEN) {
    // In development, if VITE_DEV_TOKEN is set in .env.local, use it directly.
    // See .env.local.example for setup instructions.
    renderApp({ token: import.meta.env.VITE_DEV_TOKEN });
  } else {
    initAuth(renderApp);
  }
}

function renderApp(auth) {
  ReactDOM.render(
    <Router>
      <Routes>
        {["/BulkEntryWizard", "/builder/BulkEntryWizard"].map((path, index) => {
          return (
            <Route
              path={path}
              element={
                <React.StrictMode>
                  <SnackbarProvider maxSnack={3}>
                    <ContextMainProvider>
                      <BulkEntryWizard />
                    </ContextMainProvider>
                  </SnackbarProvider>
                </React.StrictMode>
              }
              key={index}
            />
          );
        })}
        {["/", "/builder/", "*"].map((path, index) => {
          return (
            <Route
              path={path}
              element={
                <React.StrictMode>
                  <SnackbarProvider maxSnack={3}>
                    <ContextMainProvider>
                      <App auth={auth} />
                    </ContextMainProvider>
                  </SnackbarProvider>
                </React.StrictMode>
              }
              key={index}
            />
          );
        })}
      </Routes>
    </Router>,
    document.getElementById("root")
  );
}

window.addEventListener("DOMContentLoaded", () => initLoad());
