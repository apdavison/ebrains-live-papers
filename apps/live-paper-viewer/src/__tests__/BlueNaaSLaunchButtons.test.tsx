import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlueNaaSLaunchButtons from "../BlueNaaSLaunchButtons";
import { miglioreButtonsConfig } from "./fixtures";
import type { BlueNaaSLaunchButtonsConfig } from "../types";

const windowOpenSpy = vi.fn();

beforeEach(() => {
  windowOpenSpy.mockReset();
  vi.stubGlobal("open", windowOpenSpy);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("BlueNaaSLaunchButtons rendering", () => {
  it("renders the correct number of buttons", () => {
    render(<BlueNaaSLaunchButtons config={miglioreButtonsConfig} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(8);
  });

  it("displays correct labels on buttons", () => {
    render(<BlueNaaSLaunchButtons config={miglioreButtonsConfig} />);
    expect(screen.getByRole("button", { name: /int bAC 0\.6 nA/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pyr cAC 0\.8 nA/ })).toBeInTheDocument();
  });

  it("renders buttons with tooltip as title attribute", () => {
    render(<BlueNaaSLaunchButtons config={miglioreButtonsConfig} />);
    const tooltipButtons = screen.getAllByRole("button").filter(
      (btn) => btn.getAttribute("title") === "Available soon"
    );
    expect(tooltipButtons.length).toBeGreaterThan(0);
  });

  it("renders intro text when present", () => {
    render(<BlueNaaSLaunchButtons config={miglioreButtonsConfig} />);
    expect(screen.getByText(/ModelDB/)).toBeInTheDocument();
  });

  it("does not render intro text when absent", () => {
    const config: BlueNaaSLaunchButtonsConfig = {
      columns: 2,
      buttons: [{ label: "Test", bluenaasUrl: "https://example.com" }],
    };
    render(<BlueNaaSLaunchButtons config={config} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
  });
});

describe("BlueNaaSLaunchButtons interactions", () => {
  it("clicking a button calls window.open with the correct URL", async () => {
    const user = userEvent.setup();
    render(<BlueNaaSLaunchButtons config={miglioreButtonsConfig} />);
    const button = screen.getByRole("button", { name: /int bAC 0\.6 nA/ });
    await user.click(button);
    expect(windowOpenSpy).toHaveBeenCalledWith(
      miglioreButtonsConfig.buttons[0].bluenaasUrl,
      "_blank"
    );
  });
});
