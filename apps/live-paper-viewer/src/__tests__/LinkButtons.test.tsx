import { render, screen } from "@testing-library/react";
import LinkButtons from "../LinkButtons";
import type { LinkButtonsConfig } from "../types";

const config: LinkButtonsConfig = {
  buttons: [
    { label: "Download", url: "https://example.com/data.txt", icon: "archive" },
    { label: "Run", url: "https://example.com/run", icon: "play_arrow" },
  ],
};

describe("LinkButtons", () => {
  it("renders the correct number of buttons", () => {
    render(<LinkButtons config={config} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
  });

  it("renders buttons with correct labels", () => {
    render(<LinkButtons config={config} />);
    expect(screen.getByText("Download")).toBeInTheDocument();
    expect(screen.getByText("Run")).toBeInTheDocument();
  });

  it("sets correct href and target on buttons", () => {
    render(<LinkButtons config={config} />);
    const downloadLink = screen.getByText("Download").closest("a");
    expect(downloadLink).toHaveAttribute("href", "https://example.com/data.txt");
    expect(downloadLink).toHaveAttribute("target", "_blank");
  });

  it("renders material icons when specified", () => {
    render(<LinkButtons config={config} />);
    expect(screen.getByText("archive")).toBeInTheDocument();
    expect(screen.getByText("play_arrow")).toBeInTheDocument();
  });

  it("renders without icons when not specified", () => {
    const noIconConfig: LinkButtonsConfig = {
      buttons: [{ label: "Click me", url: "https://example.com" }],
    };
    render(<LinkButtons config={noIconConfig} />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
