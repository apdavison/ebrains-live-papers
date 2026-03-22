import { render, screen } from "@testing-library/react";
import NeoViewer from "../NeoViewer";
import type { NeoViewerConfig } from "../types";

vi.mock("neural-activity-visualizer-react", () => ({
  default: (props: Record<string, unknown>) => (
    <div
      data-testid="visualizer"
      data-source={props.source}
      data-height={props.height}
      data-downsamplefactor={props.downSampleFactor}
    >
      Mock Visualizer
    </div>
  ),
}));

describe("NeoViewer", () => {
  it("renders a Visualizer for each source", () => {
    const config: NeoViewerConfig = {
      sources: [
        { source: "https://example.com/data1.txt", height: 300, downSampleFactor: 4 },
        { source: "https://example.com/data2.txt", height: 400, downSampleFactor: 2 },
      ],
    };
    render(<NeoViewer config={config} />);
    const visualizers = screen.getAllByTestId("visualizer");
    expect(visualizers).toHaveLength(2);
  });

  it("passes correct props to Visualizer", () => {
    const config: NeoViewerConfig = {
      sources: [
        { source: "https://example.com/data.ibw", height: 350, downSampleFactor: 4 },
      ],
    };
    render(<NeoViewer config={config} />);
    const visualizer = screen.getByTestId("visualizer");
    expect(visualizer).toHaveAttribute("data-source", "https://example.com/data.ibw");
    expect(visualizer).toHaveAttribute("data-height", "350");
    expect(visualizer).toHaveAttribute("data-downsamplefactor", "4");
  });

  it("renders a single visualizer", () => {
    const config: NeoViewerConfig = {
      sources: [{ source: "https://example.com/single.txt" }],
    };
    render(<NeoViewer config={config} />);
    expect(screen.getAllByTestId("visualizer")).toHaveLength(1);
  });
});
