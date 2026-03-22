import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import type { BlueNaaSLaunchButtonsConfig } from "./types";
import "./BlueNaaSLaunchButtons.css";

function BlueNaaSLaunchButtons({ config }: { config: BlueNaaSLaunchButtonsConfig }) {
  return (
    <div className="bluenaas-launch-buttons">
      {config.introText && (
        <Markdown rehypePlugins={[rehypeRaw]}>{config.introText}</Markdown>
      )}
      <div
        className="button-grid"
        style={{ gridTemplateColumns: `repeat(${config.columns}, 1fr)` }}
      >
        {config.buttons.map((button) => (
          <button
            key={button.bluenaasUrl}
            type="button"
            className="btn waves-effect waves-light"
            title={button.tooltip}
            onClick={() => window.open(button.bluenaasUrl, "_blank")}
          >
            {button.label}
            <i className="material-icons right">play_arrow</i>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BlueNaaSLaunchButtons;
