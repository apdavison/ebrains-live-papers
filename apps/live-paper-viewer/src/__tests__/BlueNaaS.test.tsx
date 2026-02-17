import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlueNaaS from "../BlueNaaS";
import { martinelloConfig, mccauleyConfig, solinasConfig } from "./fixtures";
import { MockWebSocket } from "./ws-mock";

vi.mock("react-plotly.js", () => ({
  default: (props: { data: unknown[]; layout: { title?: { text?: string } } }) => (
    <div
      data-testid="plotly-chart"
      data-title={props.layout?.title?.text ?? ""}
      data-trace-count={props.data.length}
    />
  ),
}));

beforeEach(() => {
  MockWebSocket.reset();
  vi.stubGlobal("WebSocket", MockWebSocket);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Rendering tests — 2019-martinello-et-al (2 params, 3 switches, 2 charts, no presets)
// ---------------------------------------------------------------------------
describe("BlueNaaS rendering — 2019-martinello-et-al", () => {
  it("renders 2 Plotly charts with correct titles", () => {
    render(<BlueNaaS config={martinelloConfig} />);
    const charts = screen.getAllByTestId("plotly-chart");
    expect(charts).toHaveLength(2);
    expect(charts[0]).toHaveAttribute("data-title", "Voltage");
    expect(charts[1]).toHaveAttribute("data-title", "Calcium");
  });

  it("renders 2 number inputs with correct defaults", () => {
    render(<BlueNaaS config={martinelloConfig} />);
    const gkmInput = document.getElementById("gkm") as HTMLInputElement;
    const gcaInput = document.getElementById("gca") as HTMLInputElement;
    expect(gkmInput).toBeInTheDocument();
    expect(gcaInput).toBeInTheDocument();
    expect(gkmInput.value).toBe("0.005");
    expect(gcaInput.value).toBe("0.6");
    expect(gkmInput.min).toBe("0");
    expect(gkmInput.max).toBe("5");
    expect(gkmInput.step).toBe("0.001");
  });

  it("renders 3 checkboxes (reset-set, persistent-plots, single-train)", () => {
    render(<BlueNaaS config={martinelloConfig} />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
  });

  it("renders no preset buttons", () => {
    render(<BlueNaaS config={martinelloConfig} />);
    expect(screen.queryByText("Set defaults")).not.toBeInTheDocument();
  });

  it("renders a Run button", () => {
    render(<BlueNaaS config={martinelloConfig} />);
    expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Rendering tests — 2020-mccauley-et-al (2 params, 2 switches, 1 chart, no presets)
// ---------------------------------------------------------------------------
describe("BlueNaaS rendering — 2020-mccauley-et-al", () => {
  it("renders 1 Plotly chart titled Voltage", () => {
    render(<BlueNaaS config={mccauleyConfig} />);
    const charts = screen.getAllByTestId("plotly-chart");
    expect(charts).toHaveLength(1);
    expect(charts[0]).toHaveAttribute("data-title", "Voltage");
  });

  it("renders 2 number inputs with correct defaults", () => {
    render(<BlueNaaS config={mccauleyConfig} />);
    const wNMDA = document.getElementById("wNMDA") as HTMLInputElement;
    const taur = document.getElementById("taur") as HTMLInputElement;
    expect(wNMDA).toBeInTheDocument();
    expect(taur).toBeInTheDocument();
    expect(wNMDA.value).toBe("0.009");
    expect(taur.value).toBe("10");
  });

  it("renders 2 checkboxes", () => {
    render(<BlueNaaS config={mccauleyConfig} />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
  });

  it("renders no preset buttons", () => {
    render(<BlueNaaS config={mccauleyConfig} />);
    expect(screen.queryByText("Set defaults")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Rendering tests — 2019-solinas-et-al (3 params, no switches, 2 charts, 3 presets)
// ---------------------------------------------------------------------------
describe("BlueNaaS rendering — 2019-solinas-et-al", () => {
  it("renders 2 Plotly charts titled Voltage and Cai", () => {
    render(<BlueNaaS config={solinasConfig} />);
    const charts = screen.getAllByTestId("plotly-chart");
    expect(charts).toHaveLength(2);
    expect(charts[0]).toHaveAttribute("data-title", "Voltage");
    expect(charts[1]).toHaveAttribute("data-title", "Cai");
  });

  it("renders 3 number inputs all enabled (no reset-set switch)", () => {
    render(<BlueNaaS config={solinasConfig} />);
    const tstop = document.getElementById("tstop") as HTMLInputElement;
    const nbpap = document.getElementById("nbpap") as HTMLInputElement;
    const nstim = document.getElementById("nstim") as HTMLInputElement;
    expect(tstop).toBeInTheDocument();
    expect(nbpap).toBeInTheDocument();
    expect(nstim).toBeInTheDocument();
    expect(tstop).not.toBeDisabled();
    expect(nbpap).not.toBeDisabled();
    expect(nstim).not.toBeDisabled();
  });

  it("renders 0 checkboxes", () => {
    render(<BlueNaaS config={solinasConfig} />);
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  });

  it("renders 3 preset buttons (LTP11, LTP12, LTP14)", () => {
    render(<BlueNaaS config={solinasConfig} />);
    expect(screen.getByText("Set defaults")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "LTP11" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "LTP12" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "LTP14" })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Interaction tests
// ---------------------------------------------------------------------------
describe("BlueNaaS interactions", () => {
  it("typing in parameter input updates value", async () => {
    const user = userEvent.setup();
    render(<BlueNaaS config={solinasConfig} />);
    const tstop = document.getElementById("tstop") as HTMLInputElement;
    await user.clear(tstop);
    await user.type(tstop, "500");
    expect(tstop.value).toBe("500");
  });

  it("reset/set switch toggles parameter input disabled state", async () => {
    const user = userEvent.setup();
    render(<BlueNaaS config={martinelloConfig} />);
    const gkm = document.getElementById("gkm") as HTMLInputElement;
    // Initially disabled (reset/set off, hasResetSetSwitch = true)
    expect(gkm).toBeDisabled();

    // Find the reset/set checkbox — it's the first one
    const checkboxes = screen.getAllByRole("checkbox");
    const resetSetCheckbox = checkboxes[0];
    await user.click(resetSetCheckbox);
    expect(gkm).not.toBeDisabled();

    await user.click(resetSetCheckbox);
    expect(gkm).toBeDisabled();
  });

  it("preset buttons update parameter field values", async () => {
    const user = userEvent.setup();
    render(<BlueNaaS config={solinasConfig} />);
    const nbpap = document.getElementById("nbpap") as HTMLInputElement;
    const nstim = document.getElementById("nstim") as HTMLInputElement;

    // Default: nbpap=1, nstim=70
    expect(nbpap.value).toBe("1");
    expect(nstim.value).toBe("70");

    // Click LTP12: nbpap=2, nstim=50
    await user.click(screen.getByRole("button", { name: "LTP12" }));
    expect(nbpap.value).toBe("2");
    expect(nstim.value).toBe("50");

    // Click LTP14: nbpap=4, nstim=25
    await user.click(screen.getByRole("button", { name: "LTP14" }));
    expect(nbpap.value).toBe("4");
    expect(nstim.value).toBe("25");
  });

  it("out-of-range value + Run shows validation error", async () => {
    const user = userEvent.setup();
    render(<BlueNaaS config={solinasConfig} />);
    const tstop = document.getElementById("tstop") as HTMLInputElement;
    await user.clear(tstop);
    await user.type(tstop, "9999");
    await user.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText(/Please select a value for Tstop between/)).toBeInTheDocument();
  });

  it("fixing value and re-running clears validation error", async () => {
    const user = userEvent.setup();
    render(<BlueNaaS config={solinasConfig} />);
    const tstop = document.getElementById("tstop") as HTMLInputElement;

    // Set out of range
    await user.clear(tstop);
    await user.type(tstop, "9999");
    await user.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByText(/Please select a value for Tstop between/)).toBeInTheDocument();

    // Fix and re-run
    await user.clear(tstop);
    await user.type(tstop, "250");
    await user.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.queryByText(/Please select a value for Tstop between/)).not.toBeInTheDocument();
  });

  it("validation failure does not open WebSocket", async () => {
    const user = userEvent.setup();
    render(<BlueNaaS config={solinasConfig} />);
    const tstop = document.getElementById("tstop") as HTMLInputElement;
    await user.clear(tstop);
    await user.type(tstop, "9999");
    await user.click(screen.getByRole("button", { name: "Run" }));
    expect(MockWebSocket.instances).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// WebSocket simulation tests
// ---------------------------------------------------------------------------
describe("BlueNaaS WebSocket simulation", () => {
  it("Run sends set_url, set_params, run_simulation in order", async () => {
    const user = userEvent.setup();
    render(<BlueNaaS config={solinasConfig} />);
    await user.click(screen.getByRole("button", { name: "Run" }));

    const ws = MockWebSocket.latest();
    ws.simulateOpen();

    expect(ws.sent).toHaveLength(3);
    const cmds = ws.sent.map((s) => JSON.parse(s).cmd);
    expect(cmds).toEqual(["set_url", "set_params", "run_simulation"]);
  });

  it("sends default parameters when reset/set is off", async () => {
    const user = userEvent.setup();
    render(<BlueNaaS config={martinelloConfig} />);
    await user.click(screen.getByRole("button", { name: "Run" }));

    const ws = MockWebSocket.latest();
    ws.simulateOpen();

    const setParams = JSON.parse(ws.sent[1]);
    expect(setParams.cmd).toBe("set_params");
    // Default params should match config.defaultParameters
    expect(setParams.data.soma.gbar_kmb).toBe(0.005);
    expect(setParams.data.soma.gcanbar_can).toBe(0.6);
  });

  it("applies user parameter values via setNestedValue when reset/set is on", async () => {
    const user = userEvent.setup();
    render(<BlueNaaS config={martinelloConfig} />);

    // Enable reset/set (first checkbox)
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    // Change gkm value
    const gkm = document.getElementById("gkm") as HTMLInputElement;
    await user.clear(gkm);
    await user.type(gkm, "1.5");

    await user.click(screen.getByRole("button", { name: "Run" }));
    const ws = MockWebSocket.latest();
    ws.simulateOpen();

    const setParams = JSON.parse(ws.sent[1]);
    expect(setParams.data.soma.gbar_kmb).toBe(1.5);
  });

  it("merges custom switch onParameters when active (martinello single-train)", async () => {
    const user = userEvent.setup();
    render(<BlueNaaS config={martinelloConfig} />);

    // single-train is the third checkbox (index 2)
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[2]);

    await user.click(screen.getByRole("button", { name: "Run" }));
    const ws = MockWebSocket.latest();
    ws.simulateOpen();

    const setParams = JSON.parse(ws.sent[1]);
    // When single-train is on, stim[1] through stim[19] should have amp: 0.03
    expect(setParams.data["stim[1]"].amp).toBe(0.03);
    expect(setParams.data["stim[19]"].amp).toBe(0.03);
  });

  it("shows loading overlay during simulation, removes on data, updates traces", async () => {
    const user = userEvent.setup();
    render(<BlueNaaS config={mccauleyConfig} />);
    await user.click(screen.getByRole("button", { name: "Run" }));

    // Loading overlay shown
    expect(screen.getByText(/Launching simulation/)).toBeInTheDocument();

    const ws = MockWebSocket.latest();
    act(() => ws.simulateOpen());

    // Simulate response
    act(() =>
      ws.simulateMessage({
        data: {
          TIME: [0, 1, 2],
          "v(0.5)": [10, 20, 30],
        },
      })
    );

    // Loading overlay removed
    expect(screen.queryByText(/Launching simulation/)).not.toBeInTheDocument();

    // Chart should now have 1 trace
    const charts = screen.getAllByTestId("plotly-chart");
    expect(charts[0]).toHaveAttribute("data-trace-count", "1");
  });

  it("shows error overlay on WebSocket error", async () => {
    const user = userEvent.setup();
    render(<BlueNaaS config={mccauleyConfig} />);
    await user.click(screen.getByRole("button", { name: "Run" }));

    const ws = MockWebSocket.latest();
    act(() => ws.simulateError());

    expect(screen.getByText(/An error occurred/)).toBeInTheDocument();
  });

  it("persistent plots accumulates traces across multiple runs", async () => {
    const user = userEvent.setup();
    render(<BlueNaaS config={martinelloConfig} />);

    // Enable persistent plots (second checkbox)
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[1]);

    // First run
    await user.click(screen.getByRole("button", { name: "Run" }));
    let ws = MockWebSocket.latest();
    act(() => ws.simulateOpen());
    act(() =>
      ws.simulateMessage({
        data: {
          TIME: [0, 1],
          "v(0.5)": [10, 20],
          "cai(0.5)": [0.1, 0.2],
        },
      })
    );

    let charts = screen.getAllByTestId("plotly-chart");
    expect(charts[0]).toHaveAttribute("data-trace-count", "1"); // Voltage: 1 trace

    // Second run
    await user.click(screen.getByRole("button", { name: "Run" }));
    ws = MockWebSocket.latest();
    act(() => ws.simulateOpen());
    act(() =>
      ws.simulateMessage({
        data: {
          TIME: [0, 1],
          "v(0.5)": [30, 40],
          "cai(0.5)": [0.3, 0.4],
        },
      })
    );

    charts = screen.getAllByTestId("plotly-chart");
    expect(charts[0]).toHaveAttribute("data-trace-count", "2"); // Voltage: accumulated 2 traces
    expect(charts[1]).toHaveAttribute("data-trace-count", "2"); // Calcium: accumulated 2 traces
  });
});
