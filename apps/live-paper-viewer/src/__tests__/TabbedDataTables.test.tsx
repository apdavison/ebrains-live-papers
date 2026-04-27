import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TabbedDataTables from "../TabbedDataTables";
import { bruceTablesConfig } from "./fixtures";
import type { TabbedDataTablesConfig } from "../types";

describe("TabbedDataTables rendering", () => {
  it("renders the correct number of tabs from bruce data", () => {
    render(<TabbedDataTables config={bruceTablesConfig} />);
    expect(screen.getByText("apo AC5")).toBeInTheDocument();
    expect(screen.getByText("holo AC5")).toBeInTheDocument();
  });

  it("shows first tab content by default", () => {
    render(<TabbedDataTables config={bruceTablesConfig} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("switches to second tab on click", async () => {
    render(<TabbedDataTables config={bruceTablesConfig} />);
    await userEvent.click(screen.getByText("holo AC5"));
    // Row 7 only exists in apo AC5; after switching it should be gone
    expect(screen.queryByText("7")).not.toBeInTheDocument();
  });

  it("renders table headers", () => {
    const { container } = render(<TabbedDataTables config={bruceTablesConfig} />);
    const headers = container.querySelectorAll("th");
    expect(headers).toHaveLength(bruceTablesConfig.tabs[0].headers.length);
  });

  it("applies summary class to Mean row", () => {
    const { container } = render(<TabbedDataTables config={bruceTablesConfig} />);
    const summaryRows = container.querySelectorAll(".tabbed-data-tables__summary");
    expect(summaryRows).toHaveLength(1);
    expect(summaryRows[0].textContent).toContain("Mean");
  });
});

describe("TabbedDataTables with minimal config", () => {
  const config: TabbedDataTablesConfig = {
    tabs: [
      {
        id: "t1",
        label: "Table 1",
        headers: ["Name", "Value"],
        rows: [
          { cells: ["Alpha", "1.23"] },
          { cells: ["Beta", "4.56"], isSummary: true },
        ],
      },
    ],
  };

  it("renders a single tab", () => {
    render(<TabbedDataTables config={config} />);
    expect(screen.getByText("Table 1")).toBeInTheDocument();
  });

  it("renders cell content", () => {
    render(<TabbedDataTables config={config} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("1.23")).toBeInTheDocument();
  });

  it("renders HTML in headers", () => {
    const htmlConfig: TabbedDataTablesConfig = {
      tabs: [
        {
          id: "t1",
          label: "Tab",
          headers: ["<em>k</em><sub>f1</sub>"],
          rows: [{ cells: ["0.5"] }],
        },
      ],
    };
    const { container } = render(<TabbedDataTables config={htmlConfig} />);
    expect(container.querySelector("th em")).toBeInTheDocument();
    expect(container.querySelector("th sub")).toBeInTheDocument();
  });
});
