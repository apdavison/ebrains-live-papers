import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import WidgetRenderer from "./WidgetRenderer";
import type { LivePaperSection, LivePaperDataItem } from "./types";
import "./Section.css";

function Section({ data, id }: { data: LivePaperSection; id?: string }) {
  return (
    <section id={id} className="paper-section">
      <h2>{data.title}</h2>
      {data.text && <Markdown rehypePlugins={[rehypeRaw]}>{data.text}</Markdown>}
      {data.data.length > 0 && (
        <div className="section-widgets">
          {data.data.map((item: LivePaperDataItem) => (
            <WidgetRenderer key={item.identifier} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Section;
