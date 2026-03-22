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
              <img src={item.morphologyImageUrl} alt="Morphology" />
            </a>
            <iframe
              className="demo-grid-plot"
              src={item.plotIframeUrl}
              height="270"
              frameBorder="0"
              title="Plot"
            />
          </div>
        ))}
      </div>

      {config.additionalContent && (
        <>
          <div className="rainbow-row">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} />
            ))}
          </div>
          <h4>
            <strong>
              <center>{config.additionalContent.heading}</center>
            </strong>
          </h4>
          <div className="additional-content-grid">
            {config.additionalContent.items.map((item) => (
              <a
                key={item.imageUrl}
                href={item.bluenaasUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={item.imageUrl} alt="" />
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default BlueNaaSDemoGrid;
