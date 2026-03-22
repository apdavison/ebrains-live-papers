import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import BlueNaaS from "./BlueNaaS";
import BlueNaaSLaunchButtons from "./BlueNaaSLaunchButtons";
import BlueNaaSDemoGrid from "./BlueNaaSDemoGrid";
import type {
  LivePaperSection,
  LivePaperDataItem,
  Link,
  BlueNaaSConfig,
  BlueNaaSLaunchButtonsConfig,
  BlueNaaSDemoGridConfig,
} from "./types";

function Section({ data }: { data: LivePaperSection }) {
  return (
    <>
      <h2>{data.title}</h2>
      <Markdown rehypePlugins={[rehypeRaw]}>{data.text}</Markdown>
      <ul>
        {data.data.map((item: LivePaperDataItem) => {
          if (item.type === "bluenaas" && item.config) {
            return <BlueNaaS key={item.identifier} config={item.config as BlueNaaSConfig} />;
          }
          if (item.type === "bluenaas-launch-buttons" && item.config) {
            return <BlueNaaSLaunchButtons key={item.identifier} config={item.config as BlueNaaSLaunchButtonsConfig} />;
          }
          if (item.type === "bluenaas-demo-grid" && item.config) {
            return <BlueNaaSDemoGrid key={item.identifier} config={item.config as BlueNaaSDemoGridConfig} />;
          }
          return (
            <li key={item.identifier}>
              {item.label}
              {item.links.map((link: Link) => (
                <span key={link.url}><a href={link.url}>{link.service}</a></span>
              ))}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default Section;
