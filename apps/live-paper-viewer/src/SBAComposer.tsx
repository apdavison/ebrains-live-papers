import { useEffect, useRef } from "react";
import type { SBAComposerConfig } from "./types";

function SBAComposer({ config }: { config: SBAComposerConfig }) {
  const winRef = useRef<Window | null>(null);
  const idRef = useRef(1);

  useEffect(() => {
    const handler = (evt: MessageEvent) => {
      const rpc = evt.data;
      if (!rpc?.method || !winRef.current || evt.source !== winRef.current) return;
      if (rpc.method === "window.event" && rpc.params?.type === "load") {
        for (const cmd of config.commands) {
          winRef.current.postMessage(
            { jsonrpc: "2.0", id: idRef.current++, method: cmd.method.toLowerCase(), params: cmd.params },
            "*"
          );
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [config.commands, config.composerUrl]);

  function handleClick() {
    if (winRef.current && !winRef.current.closed) {
      winRef.current.focus();
    } else {
      winRef.current = window.open(config.composerUrl, "SBAComposer");
    }
  }

  return (
    <button className="app-btn" onClick={handleClick}>
      {config.buttonLabel ?? "View"}
      <i className="material-icons">3d_rotation</i>
    </button>
  );
}

export default SBAComposer;
