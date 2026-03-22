import { render, screen } from "@testing-library/react";
import BlueNaaSDemoGrid from "../BlueNaaSDemoGrid";
import { eyalDemoGridConfig } from "./fixtures";
import type { BlueNaaSDemoGridConfig } from "../types";

describe("BlueNaaSDemoGrid rendering", () => {
  it("renders the correct number of morphology images", () => {
    render(<BlueNaaSDemoGrid config={eyalDemoGridConfig} />);
    const images = screen.getAllByAltText("Morphology");
    expect(images).toHaveLength(6);
  });

  it("renders the correct number of iframes", () => {
    render(<BlueNaaSDemoGrid config={eyalDemoGridConfig} />);
    const iframes = screen.getAllByTitle("Plot");
    expect(iframes).toHaveLength(6);
  });

  it("morphology images link to BlueNaaS URLs", () => {
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

  it("renders additional content heading when present", () => {
    render(<BlueNaaSDemoGrid config={eyalDemoGridConfig} />);
    expect(
      screen.getByText("Model response to clustered vs non clustered input")
    ).toBeInTheDocument();
  });

  it("renders additional content images when present", () => {
    const { container } = render(<BlueNaaSDemoGrid config={eyalDemoGridConfig} />);
    // 6 morphology images + 2 additional content images = 8 total
    const allImages = container.querySelectorAll("img");
    expect(allImages).toHaveLength(8);
  });

  it("does not render additional content when absent", () => {
    const config: BlueNaaSDemoGridConfig = {
      items: [
        {
          morphologyImageUrl: "https://example.com/img.png",
          bluenaasUrl: "https://example.com/bluenaas",
          plotIframeUrl: "https://example.com/plot.html",
        },
      ],
    };
    render(<BlueNaaSDemoGrid config={config} />);
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.queryByText("Model response")).not.toBeInTheDocument();
  });
});
