import type { IframeGridConfig } from "./types";
import "./IframeGrid.css";

const DEFAULT_HEIGHT = 400;

function IframeGrid({ config }: { config: IframeGridConfig }) {
  return (
    <div className="iframe-grid">
      {config.rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="iframe-grid__row"
          style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}
        >
          {row.map((item, colIdx) => (
            <div key={colIdx} className="iframe-grid__cell">
              <iframe
                src={item.src}
                height={item.height ?? DEFAULT_HEIGHT}
                scrolling="no"
                title={item.caption ?? `iframe-${rowIdx}-${colIdx}`}
                className="iframe-grid__frame"
              />
              {item.caption && (
                <p className="iframe-grid__caption">{item.caption}</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default IframeGrid;
