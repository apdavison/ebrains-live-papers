import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NGLViewer from "../NGLViewer";
import type { NGLViewerConfig } from "../types";

const mockAddRepresentation = vi.fn();
const mockAutoView = vi.fn();
const mockDispose = vi.fn();
const mockHandleResize = vi.fn();
const mockSetVisibility = vi.fn();

const mockComponent = {
  addRepresentation: mockAddRepresentation,
};

const mockStage = {
  loadFile: vi.fn().mockResolvedValue(mockComponent),
  handleResize: mockHandleResize,
  dispose: mockDispose,
  autoView: mockAutoView,
  tooltip: { style: { display: "" }, remove: vi.fn() },
  signals: { hovered: { add: vi.fn() } },
  viewer: { container: document.createElement("div") },
  getRepresentationsByName: vi.fn().mockReturnValue({
    setVisibility: mockSetVisibility,
  }),
};

const MockStageImpl = vi.fn(function () {
  return mockStage;
});

vi.mock("ngl", () => ({
  Stage: MockStageImpl,
}));

// jsdom does not implement HTMLDialogElement.showModal/close
beforeEach(() => {
  HTMLDialogElement.prototype.showModal =
    HTMLDialogElement.prototype.showModal ||
    function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
  HTMLDialogElement.prototype.close =
    HTMLDialogElement.prototype.close ||
    function (this: HTMLDialogElement) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    };

  vi.clearAllMocks();
  mockStage.loadFile.mockResolvedValue(mockComponent);
});

const simpleConfig: NGLViewerConfig = {
  files: [
    {
      url: "https://files.rcsb.org/download/1AZS.cif",
      representations: [
        { type: "cartoon", color: "chainid", sele: "polymer" },
        { type: "spacefill", color: "element", sele: "not polymer and not water" },
      ],
    },
  ],
};

const configWithCheckboxes: NGLViewerConfig = {
  files: [
    {
      url: "https://example.com/structure1.pqr",
      representations: [
        { type: "cartoon", color: "peru", sele: "polymer", name: "str1" },
      ],
    },
    {
      url: "https://example.com/structure2.pqr",
      representations: [
        { type: "cartoon", color: "teal", sele: "polymer", name: "str2" },
      ],
    },
  ],
  checkboxes: [
    { label: "Structure 1", representationNames: ["str1"], defaultChecked: true },
    { label: "Structure 2", representationNames: ["str2"], defaultChecked: true },
  ],
};

describe("NGLViewer", () => {
  it("renders a View button", () => {
    render(<NGLViewer config={simpleConfig} />);
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("3d_rotation")).toBeInTheDocument();
  });

  it("creates NGL Stage when modal is opened", async () => {
    const user = userEvent.setup();
    render(<NGLViewer config={simpleConfig} />);

    await user.click(screen.getByText("View"));

    // Wait for dynamic import (multiple microtask flushes needed)
    await act(async () => {
      await vi.dynamicImportSettled();
    });

    // Stage was created, so loadFile should have been called
    expect(mockStage.loadFile).toHaveBeenCalled();
  });

  it("loads files with correct URLs", async () => {
    const user = userEvent.setup();
    render(<NGLViewer config={simpleConfig} />);

    await user.click(screen.getByText("View"));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockStage.loadFile).toHaveBeenCalledWith(
      "https://files.rcsb.org/download/1AZS.cif",
      {}
    );
  });

  it("adds representations with correct parameters", async () => {
    const user = userEvent.setup();
    render(<NGLViewer config={simpleConfig} />);

    await user.click(screen.getByText("View"));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockAddRepresentation).toHaveBeenCalledWith("cartoon", {
      color: "chainid",
      sele: "polymer",
      name: undefined,
      opacity: undefined,
      visible: true,
    });
    expect(mockAddRepresentation).toHaveBeenCalledWith("spacefill", {
      color: "element",
      sele: "not polymer and not water",
      name: undefined,
      opacity: undefined,
      visible: true,
    });
  });

  it("calls autoView after loading", async () => {
    const user = userEvent.setup();
    render(<NGLViewer config={simpleConfig} />);

    await user.click(screen.getByText("View"));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockAutoView).toHaveBeenCalled();
  });

  it("disposes stage when modal is closed", async () => {
    const user = userEvent.setup();
    render(<NGLViewer config={simpleConfig} />);

    await user.click(screen.getByText("View"));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    await user.click(screen.getByText("Close"));
    expect(mockDispose).toHaveBeenCalled();
  });

  it("renders checkboxes when config has checkboxes", async () => {
    const user = userEvent.setup();
    render(<NGLViewer config={configWithCheckboxes} />);

    await user.click(screen.getByText("View"));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(screen.getByText("Structure 1")).toBeInTheDocument();
    expect(screen.getByText("Structure 2")).toBeInTheDocument();
  });

  it("toggles representation visibility when checkbox is clicked", async () => {
    const user = userEvent.setup();
    render(<NGLViewer config={configWithCheckboxes} />);

    await user.click(screen.getByText("View"));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    expect(mockStage.getRepresentationsByName).toHaveBeenCalledWith("str1");
    expect(mockSetVisibility).toHaveBeenCalledWith(false);
  });

  it("passes asTrajectory option when configured", async () => {
    const trajectoryConfig: NGLViewerConfig = {
      files: [
        {
          url: "https://example.com/trajectory.gro",
          asTrajectory: true,
          representations: [
            { type: "cartoon", color: "chainid", sele: "polymer" },
          ],
        },
      ],
    };

    const user = userEvent.setup();
    render(<NGLViewer config={trajectoryConfig} />);

    await user.click(screen.getByText("View"));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockStage.loadFile).toHaveBeenCalledWith(
      "https://example.com/trajectory.gro",
      { asTrajectory: true }
    );
  });

  it("sets up tooltip when showTooltip is true", async () => {
    const tooltipConfig: NGLViewerConfig = {
      ...simpleConfig,
      showTooltip: true,
    };

    const user = userEvent.setup();
    render(<NGLViewer config={tooltipConfig} />);

    await user.click(screen.getByText("View"));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockStage.signals.hovered.add).toHaveBeenCalled();
  });
});
