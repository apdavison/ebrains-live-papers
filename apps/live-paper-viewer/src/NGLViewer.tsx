import { useState, useEffect, useRef, useCallback } from "react";
import Modal from "./components/Modal";
import type { NGLViewerConfig } from "./types";
import "./NGLViewer.css";

function NGLViewer({ config }: { config: NGLViewerConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stageRef = useRef<any>(null);
  const [checkboxStates, setCheckboxStates] = useState<boolean[]>(
    () => config.checkboxes?.map((cb) => cb.defaultChecked ?? true) ?? []
  );

  const hasCheckboxes = config.checkboxes && config.checkboxes.length > 0;

  const handleClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    let disposed = false;

    // Dynamic import to avoid loading NGL until needed
    import("ngl").then((NGL) => {
      if (disposed || !containerRef.current) return;

      const stage = new NGL.Stage(containerRef.current, {
        backgroundColor: "white" as unknown as number,
      });
      stageRef.current = stage;
      stage.handleResize();

      if (!config.showTooltip) {
        stage.tooltip.style.display = "none";
      }

      // Set up tooltip if requested
      if (config.showTooltip) {
        const tooltip = document.createElement("div");
        Object.assign(tooltip.style, {
          display: "none",
          position: "absolute",
          zIndex: "10",
          pointerEvents: "none",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "lightgrey",
          padding: "0.5em",
          fontFamily: "sans-serif",
        });
        stage.viewer.container.appendChild(tooltip);

        stage.signals.hovered.add(
          (pickingProxy: { atom?: { qualifiedName(): string }; bond?: unknown; closestBondAtom?: { qualifiedName(): string }; canvasPosition: { x: number; y: number } }) => {
            if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {
              const atom =
                pickingProxy.atom || pickingProxy.closestBondAtom;
              const cp = pickingProxy.canvasPosition;
              tooltip.innerText = "ATOM: " + (atom?.qualifiedName() ?? "");
              tooltip.style.bottom = cp.y + 3 + "px";
              tooltip.style.left = cp.x + 3 + "px";
              tooltip.style.display = "block";
            } else {
              tooltip.style.display = "none";
            }
          }
        );
      }

      // Load all files
      const loadPromises = config.files.map((file) =>
        stage.loadFile(file.url, file.asTrajectory ? { asTrajectory: true } : {})
      );

      Promise.all(loadPromises).then((components) => {
        if (disposed) return;

        components.forEach((component, i) => {
          if (!component) return;
          const fileConfig = config.files[i];

          for (const rep of fileConfig.representations) {
            component.addRepresentation(rep.type, {
              color: rep.color,
              sele: rep.sele,
              name: rep.name,
              opacity: rep.opacity,
              visible: rep.visible ?? true,
              ...(rep.isolevelType && { isolevelType: rep.isolevelType }),
              ...(rep.isolevel !== undefined && { isolevel: rep.isolevel }),
              ...(rep.opaqueBack !== undefined && {
                opaqueBack: rep.opaqueBack,
              }),
            });
          }
        });

        stage.autoView();
      });
    });

    return () => {
      disposed = true;
      if (stageRef.current) {
        stageRef.current.dispose();
        stageRef.current = null;
      }
    };
  }, [isOpen, config]);

  // Handle window resize
  useEffect(() => {
    if (!isOpen || !stageRef.current) return;
    const handler = () => stageRef.current?.handleResize();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [isOpen]);

  const handleCheckboxChange = (index: number, checked: boolean) => {
    setCheckboxStates((prev) => {
      const next = [...prev];
      next[index] = checked;
      return next;
    });

    const checkbox = config.checkboxes?.[index];
    if (!checkbox || !stageRef.current) return;

    for (const name of checkbox.representationNames) {
      stageRef.current
        .getRepresentationsByName(name)
        .setVisibility(checked);
    }
  };

  return (
    <>
      <button
        className="app-btn ngl-view-btn"
        onClick={() => setIsOpen(true)}
      >
        <i className="material-icons">3d_rotation</i>
        View
      </button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="ngl-viewer-container">
          <div
            ref={containerRef}
            className={`ngl-canvas${hasCheckboxes ? " ngl-canvas-with-controls" : ""}`}
          />
          {hasCheckboxes && (
            <div className="ngl-controls">
              {config.checkboxes!.map((cb, i) => (
                <label key={i} className="ngl-checkbox-label">
                  <input
                    type="checkbox"
                    className="filled-in"
                    checked={checkboxStates[i]}
                    onChange={(e) =>
                      handleCheckboxChange(i, e.target.checked)
                    }
                  />
                  <span
                    dangerouslySetInnerHTML={{ __html: cb.label }}
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

export default NGLViewer;
