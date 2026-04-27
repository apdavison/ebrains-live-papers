import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ParameterSimulation from "../ParameterSimulation";
import { lupascuParamSimConfig } from "./fixtures";
import type { ParameterSimulationConfig } from "../types";

// react-plotly.js requires a real DOM environment; the Plot component is
// mocked to avoid loading the full Plotly bundle in tests.
vi.mock("react-plotly.js", () => ({
  default: ({ data }: { data: unknown[] }) => (
    <div data-testid="plot" data-trace-count={data.length} />
  ),
}));

// Minimal config with a simple formula for isolated unit-style tests.
const simpleConfig: ParameterSimulationConfig = {
  parameters: [
    { id: "a", labelHtml: "a", default: 2, min: 0, max: 10, step: 0.1 },
    { id: "b", labelHtml: "b", default: 3, min: 0, max: 10, step: 0.1 },
  ],
  formula: "a*t + b",
  xAxisLabel: "time",
  yAxisLabel: "value",
  timeSteps: 5,
};

describe("ParameterSimulation formula evaluation", () => {
  it("renders an initial trace derived from default parameter values", () => {
    render(<ParameterSimulation config={simpleConfig} />);
    const plot = screen.getByTestId("plot");
    expect(Number(plot.getAttribute("data-trace-count"))).toBe(1);
  });

  it("renders with the lupascu GABA-A formula without errors", () => {
    render(<ParameterSimulation config={lupascuParamSimConfig} />);
    expect(screen.getByTestId("plot")).toBeInTheDocument();
  });
});

describe("ParameterSimulation rendering", () => {
  it("renders all 12 parameter inputs for lupascu config", () => {
    render(<ParameterSimulation config={lupascuParamSimConfig} />);
    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs).toHaveLength(12);
  });

  it("inputs are disabled on initial render", () => {
    render(<ParameterSimulation config={lupascuParamSimConfig} />);
    screen.getAllByRole("spinbutton").forEach((input) => expect(input).toBeDisabled());
  });

  it("renders edit mode toggle and persistent plot toggle", () => {
    render(<ParameterSimulation config={lupascuParamSimConfig} />);
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("renders a Plot button", () => {
    render(<ParameterSimulation config={lupascuParamSimConfig} />);
    expect(screen.getByRole("button", { name: /plot/i })).toBeInTheDocument();
  });

  it("shows an initial chart trace", () => {
    render(<ParameterSimulation config={lupascuParamSimConfig} />);
    expect(Number(screen.getByTestId("plot").getAttribute("data-trace-count"))).toBe(1);
  });
});

describe("ParameterSimulation interaction", () => {
  it("enables inputs when edit mode is toggled on", async () => {
    render(<ParameterSimulation config={lupascuParamSimConfig} />);
    await userEvent.click(screen.getAllByRole("checkbox")[0]);
    screen.getAllByRole("spinbutton").forEach((input) => expect(input).not.toBeDisabled());
  });

  it("disables inputs when edit mode is toggled off", async () => {
    render(<ParameterSimulation config={lupascuParamSimConfig} />);
    const toggle = screen.getAllByRole("checkbox")[0];
    await userEvent.click(toggle);
    await userEvent.click(toggle);
    screen.getAllByRole("spinbutton").forEach((input) => expect(input).toBeDisabled());
  });

  it("adds a trace when persistent mode is on and Plot is clicked twice", async () => {
    render(<ParameterSimulation config={lupascuParamSimConfig} />);
    await userEvent.click(screen.getAllByRole("checkbox")[1]); // persistent toggle
    const plotBtn = screen.getByRole("button", { name: /plot/i });
    await userEvent.click(plotBtn);
    await userEvent.click(plotBtn);
    expect(Number(screen.getByTestId("plot").getAttribute("data-trace-count"))).toBe(3);
  });

  it("replaces trace when persistent mode is off and Plot is clicked", async () => {
    render(<ParameterSimulation config={lupascuParamSimConfig} />);
    const plotBtn = screen.getByRole("button", { name: /plot/i });
    await userEvent.click(plotBtn);
    await userEvent.click(plotBtn);
    expect(Number(screen.getByTestId("plot").getAttribute("data-trace-count"))).toBe(1);
  });
});
