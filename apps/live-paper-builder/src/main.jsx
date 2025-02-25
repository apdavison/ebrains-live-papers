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
  } else {
    initAuth(renderApp);
    // for local development, set a valid token and uncomment the next 4 lines
    // const auth = {
    //   token: "eyJ..."
    // }
    // renderApp(auth);
  }
}

function renderApp(auth) {
  console.log(auth);
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
