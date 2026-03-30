import BlueNaaS from "./BlueNaaS";
import BlueNaaSDemoGrid from "./BlueNaaSDemoGrid";
import LinkButtons from "./LinkButtons";
import NeoViewer from "./NeoViewer";
import NGLViewer from "./NGLViewer";
import TabbedCollapsible from "./TabbedCollapsible";
import type {
  LivePaperDataItem,
  Link,
  BlueNaaSConfig,
  BlueNaaSDemoGridConfig,
  LinkButtonsConfig,
  NeoViewerConfig,
  NGLViewerConfig,
  TabbedCollapsibleConfig,
} from "./types";

function WidgetRenderer({ item }: { item: LivePaperDataItem }) {
  if (item.type === "bluenaas" && item.config) {
    return <BlueNaaS config={item.config as BlueNaaSConfig} />;
  }
  if (item.type === "bluenaas-demo-grid" && item.config) {
    return <BlueNaaSDemoGrid config={item.config as BlueNaaSDemoGridConfig} />;
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
  if (item.type === "tabbed-collapsible" && item.config) {
    return <TabbedCollapsible config={item.config as TabbedCollapsibleConfig} />;
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
