import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CopiesGenerator from "../CopiesGenerator";
import type { CopiesGeneratorConfig } from "../types";

vi.mock("react-plotly.js", () => ({
  default: ({ data }: { data: unknown[] }) => (
    <div data-testid="plot" data-trace-count={data.length} />
  ),
}));

const x = [1, 21, 41];
const boundary = { x, yMax: [1, 2, 3], yMin: [0, 0, 0] };

const minimalConfig: CopiesGeneratorConfig = {
  neuronTypes: [
    { id: "pyr", label: "Pyramidal", group: "pyramidal", maxAll: 100, maxClassified: 90 },
    { id: "bac", label: "Interneuron bAC", group: "interneuron", typeFilter: "BAC", maxAll: 50, maxClassified: 30 },
  ],
  pyramidal: {
    allUrl: "https://example.com/pyr-all",
    classifiedUrl: "https://example.com/pyr-classified",
    boundaries: { "400": boundary, "600": boundary },
  },
  interneuron: {
    allUrl: "https://example.com/int-all",
    classifiedUrl: "https://example.com/int-classified",
    boundaries: { "400": boundary, "600": boundary },
  },
  stimulusLevels: [400, 600],
  defaultQuantity: 2,
};

const mockCopiesData = {
  copy1: { name: "copy1", spike_times_sim: { "400": ["10", "20"], "600": ["15", "25"] } },
  copy2: { name: "copy2", spike_times_sim: { "400": ["11", "21"], "600": ["16", "26"] } },
  copy3: { name: "copy3", spike_times_sim: { "400": ["12", "22"], "600": ["17", "27"] } },
};

const mockInterneuronData = {
  copy1: { name: "copy1", type: "BAC", spike_times_sim: { "400": ["10", "20"], "600": ["15", "25"] } },
  copy2: { name: "copy2", type: "CAC", spike_times_sim: { "400": ["11", "21"], "600": ["16", "26"] } },
};

function mockFetchWith(data: object) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    })
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("CopiesGenerator rendering", () => {
  it("renders source radio buttons", () => {
    render(<CopiesGenerator config={minimalConfig} />);
    expect(screen.getByRole("radio", { name: /all copies/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /classified copies/i })).toBeInTheDocument();
  });

  it("renders neuron type radio buttons", () => {
    render(<CopiesGenerator config={minimalConfig} />);
    expect(screen.getByRole("radio", { name: /pyramidal/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /interneuron bac/i })).toBeInTheDocument();
  });

  it("renders quantity input with default value", () => {
    render(<CopiesGenerator config={minimalConfig} />);
    expect(screen.getByRole("spinbutton")).toHaveValue(2);
  });

  it("renders Get Copies button", () => {
    render(<CopiesGenerator config={minimalConfig} />);
    expect(screen.getByRole("button", { name: /get copies/i })).toBeInTheDocument();
  });

  it("Plot copies button is disabled before fetch", () => {
    render(<CopiesGenerator config={minimalConfig} />);
    expect(screen.getByRole("button", { name: /plot copies/i })).toBeDisabled();
  });

  it("Download button is disabled before fetch", () => {
    render(<CopiesGenerator config={minimalConfig} />);
    expect(screen.getByRole("button", { name: /download/i })).toBeDisabled();
  });
});

describe("CopiesGenerator interaction", () => {
  it("fetches from the pyramidal all-copies URL by default", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCopiesData),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<CopiesGenerator config={minimalConfig} />);
    await userEvent.click(screen.getByRole("button", { name: /get copies/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("https://example.com/pyr-all"));
  });

  it("fetches from classified URL when classified source is selected", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCopiesData),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<CopiesGenerator config={minimalConfig} />);
    await userEvent.click(screen.getByRole("radio", { name: /classified copies/i }));
    await userEvent.click(screen.getByRole("button", { name: /get copies/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("https://example.com/pyr-classified"));
  });

  it("enables Plot and Download buttons after successful fetch", async () => {
    mockFetchWith(mockCopiesData);
    render(<CopiesGenerator config={minimalConfig} />);
    await userEvent.click(screen.getByRole("button", { name: /get copies/i }));

    await waitFor(() => expect(screen.getByRole("button", { name: /plot copies/i })).not.toBeDisabled());
    expect(screen.getByRole("button", { name: /download/i })).not.toBeDisabled();
  });

  it("shows plots after clicking Plot copies", async () => {
    mockFetchWith(mockCopiesData);
    render(<CopiesGenerator config={minimalConfig} />);
    await userEvent.click(screen.getByRole("button", { name: /get copies/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: /plot copies/i })).not.toBeDisabled());
    await userEvent.click(screen.getByRole("button", { name: /plot copies/i }));

    // One plot per stimulus level
    expect(screen.getAllByTestId("plot")).toHaveLength(minimalConfig.stimulusLevels.length);
  });

  it("filters interneuron copies by typeFilter", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockInterneuronData),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<CopiesGenerator config={minimalConfig} />);
    await userEvent.click(screen.getByRole("radio", { name: /interneuron bac/i }));
    await userEvent.click(screen.getByRole("button", { name: /get copies/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("https://example.com/int-all"));
    await waitFor(() => expect(screen.getByRole("button", { name: /plot copies/i })).not.toBeDisabled());

    await userEvent.click(screen.getByRole("button", { name: /plot copies/i }));
    // Only BAC copy should be selected (1 copy + 2 boundaries = 3 traces per plot)
    const plots = screen.getAllByTestId("plot");
    plots.forEach((plot) => {
      expect(Number(plot.getAttribute("data-trace-count"))).toBe(3); // 1 copy + 2 bounds
    });
  });
});
