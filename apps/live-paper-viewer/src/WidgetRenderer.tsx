import BlueNaaS from "./BlueNaaS";
import BlueNaaSDemoGrid from "./BlueNaaSDemoGrid";
import CopiesGenerator from "./CopiesGenerator";
import IframeGrid from "./IframeGrid";
import SBAComposer from "./SBAComposer";
import LinkButtons from "./LinkButtons";
import NeoViewer from "./NeoViewer";
import NGLViewer from "./NGLViewer";
import ParameterSimulation from "./ParameterSimulation";
import TabbedCollapsible from "./TabbedCollapsible";
import TabbedDataTables from "./TabbedDataTables";
import { useState, useEffect, useRef } from "react";
import "./WidgetRenderer.css";
import type {
  LivePaperDataItem,
  Link,
  BlueNaaSConfig,
  BlueNaaSDemoGridConfig,
  CopiesGeneratorConfig,
  IframeGridConfig,
  SBAComposerConfig,
  LinkButtonsConfig,
  NeoViewerConfig,
  NGLViewerConfig,
  ParameterSimulationConfig,
  TabbedCollapsibleConfig,
  TabbedDataTablesConfig,
} from "./types";

function renderWidget(item: LivePaperDataItem) {
  if (item.type === "bluenaas" && item.config)
    return <BlueNaaS config={item.config as BlueNaaSConfig} />;
  if (item.type === "bluenaas-demo-grid" && item.config)
    return <BlueNaaSDemoGrid config={item.config as BlueNaaSDemoGridConfig} />;
  if (item.type === "copies-generator" && item.config)
    return <CopiesGenerator config={item.config as CopiesGeneratorConfig} />;
  if (item.type === "iframe-grid" && item.config)
    return <IframeGrid config={item.config as IframeGridConfig} />;
  if (item.type === "sba-composer" && item.config)
    return <SBAComposer config={item.config as SBAComposerConfig} />;
  if (item.type === "link-buttons" && item.config)
    return <LinkButtons config={item.config as LinkButtonsConfig} />;
  if (item.type === "neo-viewer" && item.config)
    return <NeoViewer config={item.config as NeoViewerConfig} />;
  if (item.type === "ngl-viewer" && item.config)
    return <NGLViewer config={item.config as NGLViewerConfig} />;
  if (item.type === "parameter-simulation" && item.config)
    return <ParameterSimulation config={item.config as ParameterSimulationConfig} />;
  if (item.type === "tabbed-collapsible" && item.config)
    return <TabbedCollapsible config={item.config as TabbedCollapsibleConfig} />;
  if (item.type === "tabbed-data-tables" && item.config)
    return <TabbedDataTables config={item.config as TabbedDataTablesConfig} />;
  if (item.type === "URL") {
    return (
      <div className="url-item">
        <span className="url-item-label">{item.label}</span>
        <div className="url-item-links">
          {item.links.map((link: Link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="app-btn app-btn--outline"
            >
              {link.service}
            </a>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function WidgetRenderer({ item }: { item: LivePaperDataItem }) {
  const widget = renderWidget(item);
  const [open, setOpen] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(e: MouseEvent) {
      if (!footerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const label = (item.label && item.type !== "URL") ? <p className="widget-label">{item.label}</p> : null;

  if (!import.meta.env.DEV) return <>{label}{widget}</>;
  return (
    <div>
      {label}
      {widget}
      <div className="widget-dev-footer" ref={footerRef}>
        <span className="widget-dev-label" onClick={() => setOpen(o => !o)}>
          {item.type}
        </span>
        {open && item.config && (
          <pre className="widget-dev-tooltip">{JSON.stringify(item.config, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}

export default WidgetRenderer;
