import type { LinkButtonsConfig } from "./types";
import "./LinkButtons.css";

function LinkButtons({ config }: { config: LinkButtonsConfig }) {
  return (
    <div
      className="link-buttons"
      style={
        config.columns
          ? { display: "grid", gridTemplateColumns: `repeat(${config.columns}, 1fr)` }
          : undefined
      }
    >
      {config.buttons.map((button) => (
        <a
          key={button.url}
          className="btn waves-effect waves-light"
          href={button.url}
          target="_blank"
          rel="noopener noreferrer"
          title={button.tooltip}
        >
          {button.label}
          {button.icon && <i className="material-icons right">{button.icon}</i>}
        </a>
      ))}
    </div>
  );
}

export default LinkButtons;
