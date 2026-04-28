import { render, screen } from "@testing-library/react";
import BlueNaaSDemoGrid from "../BlueNaaSDemoGrid";
import { eyalDemoGridConfig } from "./fixtures";
import type { BlueNaaSDemoGridConfig } from "../types";

describe("BlueNaaSDemoGrid rendering", () => {
  it("renders the correct number of images", () => {
    render(<BlueNaaSDemoGrid config={eyalDemoGridConfig} />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(6);
  });

  it("renders the correct number of iframes", () => {
    render(<BlueNaaSDemoGrid config={eyalDemoGridConfig} />);
    const iframes = screen.getAllByTitle("Plot");
    expect(iframes).toHaveLength(6);
  });

  it("images link to BlueNaaS URLs", () => {
    render(<BlueNaaSDemoGrid config={eyalDemoGridConfig} />);
    const links = screen.getAllByRole("link");
    const firstLink = links[0];
    expect(firstLink.getAttribute("href")).toContain("bluenaas-single-cell.apps.ebrains.eu");
    expect(firstLink.getAttribute("target")).toBe("_blank");
  });

  it("iframes have correct src URLs", () => {
    render(<BlueNaaSDemoGrid config={eyalDemoGridConfig} />);
    const iframes = screen.getAllByTitle("Plot");
    expect(iframes[0].getAttribute("src")).toContain("Cell_130303.html");
  });

  it("does not render iframes when plotIframeUrl is absent", () => {
    const config: BlueNaaSDemoGridConfig = {
      items: [
        {
          imageUrl: "https://example.com/img.png",
          bluenaasUrl: "https://example.com/bluenaas",
        },
      ],
    };
    render(<BlueNaaSDemoGrid config={config} />);
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.queryByTitle("Plot")).not.toBeInTheDocument();
  });
});
