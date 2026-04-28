import "./docs.css";

interface Props {
  navigateTo: (page: string) => void;
}

export default function Find({ navigateTo: _navigateTo }: Props) {
  return (
    <div>
      <div
        style={{
          paddingLeft: "5%",
          paddingRight: "5%",
          textAlign: "justify",
          fontSize: 16,
          lineHeight: 1.75,
          marginTop: "40px",
          marginBottom: "40px",
        }}
      >
        <div className="title-solid-style" style={{ fontSize: 44 }}>
          Find Live Papers
        </div>
        <div
          className="title-solid-style"
          style={{ fontSize: 32, color: "var(--color-primary)" }}
        >
          Find and explore live papers
        </div>
      </div>

      <div className="block">
        <div className="block-little-header">Live Paper Platform</div>
        <div className="block-main-header">Collection of all public live papers</div>
        <div className="block-text">
          Published live papers are freely accessible on the live paper platform.
          The live papers are listed in reverse chronological order:
          <div style={{ textAlign: "center" }}>
            <img
              alt=""
              src="/figures/find/live_paper_homepage.png"
              width="90%"
            />
          </div>
          <br />
          You can click on any entry to view that specific live paper:
          <div style={{ textAlign: "center" }}>
            <img
              alt=""
              src="/figures/find/live_paper_migliore_2018.png"
              width="90%"
            />
          </div>
        </div>
      </div>

      <div className="block">
        <div className="block-little-header">Searching / Filtering</div>
        <div className="block-main-header">
          Searching / Filtering the list of live papers
        </div>
        <div className="block-text">
          The live paper platform allows users to search for specific live papers
          and/or shortlist live papers based on specific criteria, such as:
          <ul>
            <li>title of associated published article</li>
            <li>the year of publication</li>
            <li>the publishing journal</li>
            <li>names of associated author(s)</li>
            <li>keyword search of abstract</li>
          </ul>
        </div>
      </div>

      <div className="block">
        <div className="block-little-header">Resources</div>
        <div className="block-main-header">Accessing shared resources</div>
        <div className="block-text">
          For computational modeling studies, we have found that the most common
          resources being distributed comprise of the following:
          <ul>
            <li>Morphologies</li>
            <li>Electrophysiological Recordings</li>
            <li>Models</li>
            <li>Other Content</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
