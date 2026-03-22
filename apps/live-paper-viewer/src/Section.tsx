import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import WidgetRenderer from "./WidgetRenderer";
import type { LivePaperSection, LivePaperDataItem } from "./types";

function Section({ data }: { data: LivePaperSection }) {
  return (
    <>
      <h2>{data.title}</h2>
      <Markdown rehypePlugins={[rehypeRaw]}>{data.text}</Markdown>
      <ul>
        {data.data.map((item: LivePaperDataItem) => (
          <WidgetRenderer key={item.identifier} item={item} />
        ))}
      </ul>
    </>
  );
}

export default Section;
