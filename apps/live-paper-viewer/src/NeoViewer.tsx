import Visualizer from "neural-activity-visualizer-react";
import "neural-activity-visualizer-react/style.css";
import type { NeoViewerConfig } from "./types";
import "./NeoViewer.css";

function NeoViewer({ config }: { config: NeoViewerConfig }) {
  return (
    <div className="neo-viewer">
      {config.sources.map((source) => (
        <div key={source.source} className="neo-viewer-item">
          <Visualizer
            source={source.source}
            height={source.height ?? 300}
            downSampleFactor={source.downSampleFactor ?? 1}
            segmentId={source.segmentId}
            signalId={source.signalId}
            showSignals={source.showSignals ?? true}
            showSpikeTrains={source.showSpikeTrains ?? false}
            ioType={source.ioType}
          />
        </div>
      ))}
    </div>
  );
}

export default NeoViewer;
