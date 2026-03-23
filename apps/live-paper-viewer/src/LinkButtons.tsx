import { useState } from "react";
import type { LinkButton, LinkButtonsConfig } from "./types";
import "./LinkButtons.css";

async function handleDownload(url: string, filename: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

function DownloadButton({ button }: { button: LinkButton }) {
  const [downloading, setDownloading] = useState(false);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    if (downloading) return;
    setDownloading(true);
    try {
      await handleDownload(button.url, button.downloadFilename!);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <a
      className={`btn waves-effect waves-light${downloading ? " disabled" : ""}`}
      href={button.url}
      onClick={onClick}
      title={button.tooltip}
    >
      {button.label}
      {button.icon && <i className="material-icons right">{button.icon}</i>}
    </a>
  );
}

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
      {config.buttons.map((button) =>
        button.downloadFilename ? (
          <DownloadButton key={button.url} button={button} />
        ) : (
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
        )
      )}
    </div>
  );
}

export default LinkButtons;
