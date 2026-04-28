import ReactMarkdown from "react-markdown";
import type { FigureConfig } from "./types";
import "./Figure.css";

function Figure({ config }: { config: FigureConfig }) {
  return (
    <figure className="figure-widget">
      <img src={config.url} alt={config.altText ?? ""} />
      {config.caption && (
        <figcaption>
          <ReactMarkdown>{config.caption}</ReactMarkdown>
        </figcaption>
      )}
    </figure>
  );
}

export default Figure;
