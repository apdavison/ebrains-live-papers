import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SBAComposer from "../SBAComposer";
import type { SBAComposerConfig } from "../types";

const minimalConfig: SBAComposerConfig = {
  composerUrl: "https://example.com/sba-composer",
  buttonLabel: "View in SBA Composer",
  commands: [
    { method: "Composer.scene", params: { name: "test region", regions: { STRd: ["#98D6F9", 0.9] } } },
  ],
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SBAComposer rendering", () => {
  it("renders the configured button label", () => {
    render(<SBAComposer config={minimalConfig} />);
    expect(screen.getByRole("button", { name: /view in sba composer/i })).toBeInTheDocument();
  });

  it("falls back to 'View' when no buttonLabel is set", () => {
    const cfg = { ...minimalConfig, buttonLabel: undefined };
    render(<SBAComposer config={cfg} />);
    expect(screen.getByRole("button", { name: /view/i })).toBeInTheDocument();
  });
});

describe("SBAComposer interaction", () => {
  it("calls window.open with the composerUrl on first click", async () => {
    const mockWin = { closed: false, focus: vi.fn(), postMessage: vi.fn() } as unknown as Window;
    const openSpy = vi.spyOn(window, "open").mockReturnValue(mockWin);

    render(<SBAComposer config={minimalConfig} />);
    await userEvent.click(screen.getByRole("button"));

    expect(openSpy).toHaveBeenCalledWith(minimalConfig.composerUrl, "SBAComposer");
  });

  it("focuses the existing window instead of reopening when already open", async () => {
    const mockWin = { closed: false, focus: vi.fn(), postMessage: vi.fn() } as unknown as Window;
    const openSpy = vi.spyOn(window, "open").mockReturnValue(mockWin);

    render(<SBAComposer config={minimalConfig} />);
    const btn = screen.getByRole("button");

    await userEvent.click(btn); // opens popup
    await userEvent.click(btn); // should focus, not reopen

    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(mockWin.focus).toHaveBeenCalledTimes(1);
  });

  it("sends JSON-RPC commands to the popup when the ready message is received", async () => {
    const mockWin = { closed: false, focus: vi.fn(), postMessage: vi.fn() } as unknown as Window;
    vi.spyOn(window, "open").mockReturnValue(mockWin);

    render(<SBAComposer config={minimalConfig} />);
    await userEvent.click(screen.getByRole("button"));

    // Simulate the SBA Composer popup signalling ready
    window.dispatchEvent(
      new MessageEvent("message", {
        data: { method: "window.event", params: { type: "load" } },
        source: mockWin as unknown as MessageEventSource,
      })
    );

    expect(mockWin.postMessage).toHaveBeenCalledTimes(minimalConfig.commands.length);
    const call = (mockWin.postMessage as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(call.jsonrpc).toBe("2.0");
    expect(call.method).toBe("composer.scene"); // lowercased
    expect(call.params).toEqual(minimalConfig.commands[0].params);
  });

  it("ignores ready messages from other windows", async () => {
    const mockWin = { closed: false, focus: vi.fn(), postMessage: vi.fn() } as unknown as Window;
    vi.spyOn(window, "open").mockReturnValue(mockWin);

    render(<SBAComposer config={minimalConfig} />);
    await userEvent.click(screen.getByRole("button"));

    const otherWin = { closed: false } as unknown as Window;
    window.dispatchEvent(
      new MessageEvent("message", {
        data: { method: "window.event", params: { type: "load" } },
        source: otherWin as unknown as MessageEventSource,
      })
    );

    expect(mockWin.postMessage).not.toHaveBeenCalled();
  });
});
