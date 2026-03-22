import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TabbedCollapsible from "../TabbedCollapsible";
import { lupascuTabbedConfig, hjorthTabbedConfig } from "./fixtures";
import type { TabbedCollapsibleConfig } from "../types";

vi.mock("neural-activity-visualizer-react", () => ({
  default: ({ source }: { source: string }) => (
    <div data-testid="visualizer" data-source={source}>
      Mock Visualizer
    </div>
  ),
}));

describe("TabbedCollapsible with lupascu data", () => {
  it("renders all tabs", () => {
    render(<TabbedCollapsible config={lupascuTabbedConfig} />);
    expect(screen.getByText("Experiment A")).toBeInTheDocument();
    expect(screen.getByText("Experiment B")).toBeInTheDocument();
    expect(screen.getByText("Experiment C")).toBeInTheDocument();
  });

  it("shows first tab items by default", () => {
    render(<TabbedCollapsible config={lupascuTabbedConfig} />);
    const firstItem = lupascuTabbedConfig.tabs[0].items[0];
    expect(screen.getByText(firstItem.label)).toBeInTheDocument();
  });

  it("does not render visualizers when collapsed", () => {
    render(<TabbedCollapsible config={lupascuTabbedConfig} />);
    expect(screen.queryByTestId("visualizer")).not.toBeInTheDocument();
  });

  it("renders visualizer when item is expanded", async () => {
    const user = userEvent.setup();
    render(<TabbedCollapsible config={lupascuTabbedConfig} />);
    const firstItem = lupascuTabbedConfig.tabs[0].items[0];
    await user.click(screen.getByText(firstItem.label));
    expect(screen.getByTestId("visualizer")).toBeInTheDocument();
  });

  it("switches tabs and shows correct items", async () => {
    const user = userEvent.setup();
    render(<TabbedCollapsible config={lupascuTabbedConfig} />);
    await user.click(screen.getByText("Experiment B"));
    const firstItemB = lupascuTabbedConfig.tabs[1].items[0];
    expect(screen.getByText(firstItemB.label)).toBeInTheDocument();
  });
});

describe("TabbedCollapsible with hjorth data", () => {
  it("renders all 4 tabs", () => {
    render(<TabbedCollapsible config={hjorthTabbedConfig} />);
    expect(screen.getByText("SPN")).toBeInTheDocument();
    expect(screen.getByText("FS")).toBeInTheDocument();
    expect(screen.getByText("LTS")).toBeInTheDocument();
    expect(screen.getByText("ChIN")).toBeInTheDocument();
  });

  it("renders Run and Download buttons when item is expanded", async () => {
    const user = userEvent.setup();
    render(<TabbedCollapsible config={hjorthTabbedConfig} />);
    const firstItem = hjorthTabbedConfig.tabs[0].items[0];
    await user.click(screen.getByText(firstItem.label));
    expect(screen.getByText("Run")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  it("renders multiple visualizers when item is expanded", async () => {
    const user = userEvent.setup();
    render(<TabbedCollapsible config={hjorthTabbedConfig} />);
    const firstItem = hjorthTabbedConfig.tabs[0].items[0];
    await user.click(screen.getByText(firstItem.label));
    const visualizers = screen.getAllByTestId("visualizer");
    expect(visualizers.length).toBeGreaterThan(1);
  });

  it("unmounts visualizers when item is collapsed", async () => {
    const user = userEvent.setup();
    render(<TabbedCollapsible config={hjorthTabbedConfig} />);
    const firstItem = hjorthTabbedConfig.tabs[0].items[0];
    // Open
    await user.click(screen.getByText(firstItem.label));
    expect(screen.getAllByTestId("visualizer").length).toBeGreaterThan(0);
    // Close
    await user.click(screen.getByText(firstItem.label));
    expect(screen.queryByTestId("visualizer")).not.toBeInTheDocument();
  });
});

describe("TabbedCollapsible with intro text", () => {
  it("renders intro text when present", () => {
    const config: TabbedCollapsibleConfig = {
      introText: "Some **intro** text",
      tabs: [{ id: "t1", label: "Tab 1", items: [] }],
    };
    render(<TabbedCollapsible config={config} />);
    expect(screen.getByText("intro")).toBeInTheDocument();
  });
});
