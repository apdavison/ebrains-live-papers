import { render, screen } from "@testing-library/react";
import LinkButtons from "../LinkButtons";
import { miglioreButtonsConfig } from "./fixtures";
import type { LinkButtonsConfig } from "../types";

describe("LinkButtons rendering", () => {
  it("renders the correct number of buttons from migliore data", () => {
    render(<LinkButtons config={miglioreButtonsConfig} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(8);
  });

  it("renders buttons with correct labels", () => {
    render(<LinkButtons config={miglioreButtonsConfig} />);
    expect(screen.getByText(/int bAC 0\.6 nA/)).toBeInTheDocument();
    expect(screen.getByText(/pyr cAC 0\.8 nA/)).toBeInTheDocument();
  });

  it("sets correct href and target on buttons", () => {
    const config: LinkButtonsConfig = {
      buttons: [
        { label: "Download", url: "https://example.com/data.txt", icon: "archive" },
      ],
    };
    render(<LinkButtons config={config} />);
    const link = screen.getByText("Download").closest("a");
    expect(link).toHaveAttribute("href", "https://example.com/data.txt");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders material icons when specified", () => {
    render(<LinkButtons config={miglioreButtonsConfig} />);
    const icons = screen.getAllByText("play_arrow");
    expect(icons.length).toBe(8);
  });

  it("renders without icons when not specified", () => {
    const config: LinkButtonsConfig = {
      buttons: [{ label: "Click me", url: "https://example.com" }],
    };
    render(<LinkButtons config={config} />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});

describe("LinkButtons tooltip", () => {
  it("renders tooltip as title attribute", () => {
    const config: LinkButtonsConfig = {
      buttons: [
        { label: "Run", url: "https://example.com", tooltip: "Available soon" },
      ],
    };
    render(<LinkButtons config={config} />);
    const link = screen.getByText("Run").closest("a");
    expect(link).toHaveAttribute("title", "Available soon");
  });

  it("renders tooltips from migliore data", () => {
    render(<LinkButtons config={miglioreButtonsConfig} />);
    const tooltipLinks = screen.getAllByRole("link").filter(
      (link) => link.getAttribute("title") === "Available soon"
    );
    expect(tooltipLinks.length).toBeGreaterThan(0);
  });
});

describe("LinkButtons grid layout", () => {
  it("uses grid layout when columns is specified", () => {
    const config: LinkButtonsConfig = {
      columns: 2,
      buttons: [
        { label: "A", url: "https://a.com" },
        { label: "B", url: "https://b.com" },
      ],
    };
    const { container } = render(<LinkButtons config={config} />);
    const wrapper = container.querySelector(".link-buttons") as HTMLElement;
    expect(wrapper.style.display).toBe("grid");
    expect(wrapper.style.gridTemplateColumns).toBe("repeat(2, 1fr)");
  });

  it("uses default flex layout when columns is not specified", () => {
    const config: LinkButtonsConfig = {
      buttons: [{ label: "A", url: "https://a.com" }],
    };
    const { container } = render(<LinkButtons config={config} />);
    const wrapper = container.querySelector(".link-buttons") as HTMLElement;
    expect(wrapper.style.display).not.toBe("grid");
  });

  it("renders migliore data with columns", () => {
    render(<LinkButtons config={miglioreButtonsConfig} />);
    expect(miglioreButtonsConfig.columns).toBeDefined();
  });
});
