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

function WidgetRenderer({ item }: { item: LivePaperDataItem }) {
  if (item.type === "bluenaas" && item.config) {
    return <BlueNaaS config={item.config as BlueNaaSConfig} />;
  }
  if (item.type === "bluenaas-demo-grid" && item.config) {
    return <BlueNaaSDemoGrid config={item.config as BlueNaaSDemoGridConfig} />;
  }
  if (item.type === "copies-generator" && item.config) {
    return <CopiesGenerator config={item.config as CopiesGeneratorConfig} />;
  }
  if (item.type === "iframe-grid" && item.config) {
    return <IframeGrid config={item.config as IframeGridConfig} />;
  }
  if (item.type === "sba-composer" && item.config) {
    return <SBAComposer config={item.config as SBAComposerConfig} />;
  }
  if (item.type === "link-buttons" && item.config) {
    return <LinkButtons config={item.config as LinkButtonsConfig} />;
  }
  if (item.type === "neo-viewer" && item.config) {
    return <NeoViewer config={item.config as NeoViewerConfig} />;
  }
  if (item.type === "ngl-viewer" && item.config) {
    return <NGLViewer config={item.config as NGLViewerConfig} />;
  }
  if (item.type === "parameter-simulation" && item.config) {
    return <ParameterSimulation config={item.config as ParameterSimulationConfig} />;
  }
  if (item.type === "tabbed-collapsible" && item.config) {
    return <TabbedCollapsible config={item.config as TabbedCollapsibleConfig} />;
  }
  if (item.type === "tabbed-data-tables" && item.config) {
    return <TabbedDataTables config={item.config as TabbedDataTablesConfig} />;
  }
  return (
    <li>
      {item.label}
      {item.links.map((link: Link) => (
        <span key={link.url}>
          <a href={link.url}>{link.service}</a>
        </span>
      ))}
    </li>
  );
}

export default WidgetRenderer;
