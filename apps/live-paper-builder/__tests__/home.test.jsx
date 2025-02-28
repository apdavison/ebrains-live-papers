import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import React from "react";
import { SnackbarProvider } from "notistack";
import { Route } from "react-router-dom";

import { ContextMainProvider } from "../src/ContextMain";

import App from "../src/App";

describe("test home page", () => {

  // this test requires a valid auth token to have been set in globals.js,
  test("page renders correctly", { timeout: 10000 }, async () => {
    const auth = {
      token: "Bearer eyJh....",
    };

    render(
      <ContextMainProvider>
        <App auth={auth} />
      </ContextMainProvider>
    );

    expect(screen.getByText("EBRAINS Live Paper Builder")).toBeDefined();

  });
});
