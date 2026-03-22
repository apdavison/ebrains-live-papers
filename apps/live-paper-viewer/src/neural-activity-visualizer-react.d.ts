declare module "neural-activity-visualizer-react/style.css";

declare module "neural-activity-visualizer-react" {
  import type { ComponentType } from "react";

  interface VisualizerProps {
    source: string;
    baseUrl?: string;
    segmentId?: number | "all";
    signalId?: number;
    showSignals?: boolean;
    showSpikeTrains?: boolean;
    width?: number | string;
    height?: number | string;
    downSampleFactor?: number;
    disableChoice?: boolean;
    ioType?: string;
  }

  const Visualizer: ComponentType<VisualizerProps>;
  export default Visualizer;
}
