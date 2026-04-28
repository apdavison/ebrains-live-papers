import type { BlueNaaSDemoGridConfig } from "./types";
import "./BlueNaaSDemoGrid.css";

function BlueNaaSDemoGrid({ config }: { config: BlueNaaSDemoGridConfig }) {
  return (
    <div className="bluenaas-demo-grid">
      <div className="demo-grid">
        {config.items.map((item) => (
          <div key={item.plotIframeUrl} className="demo-grid-pair">
            <a
              className="demo-grid-thumbnail"
              href={item.bluenaasUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={item.imageUrl} alt="" />
            </a>
            {item.plotIframeUrl && (
              <iframe
                className="demo-grid-plot"
                src={item.plotIframeUrl}
                height="270"
                frameBorder="0"
                title="Plot"
              />
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export default BlueNaaSDemoGrid;
