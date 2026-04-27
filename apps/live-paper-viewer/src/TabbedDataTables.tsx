import { useState } from "react";
import Tabs from "./components/Tabs";
import type { TabbedDataTablesConfig } from "./types";
import "./TabbedDataTables.css";

function TabbedDataTables({ config }: { config: TabbedDataTablesConfig }) {
  const [activeTab, setActiveTab] = useState(config.tabs[0]?.id ?? "");
  const activeTable = config.tabs.find((t) => t.id === activeTab);
  const tabDefs = config.tabs.map((t) => ({ id: t.id, label: t.label }));

  return (
    <div className="tabbed-data-tables">
      <Tabs tabs={tabDefs} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTable && (
        <div className="tabbed-data-tables__content">
          <table className="tabbed-data-tables__table">
            <thead>
              <tr>
                {activeTable.headers.map((h, i) => (
                  <th key={i} dangerouslySetInnerHTML={{ __html: h }} />
                ))}
              </tr>
            </thead>
            <tbody>
              {activeTable.rows.map((row, i) => (
                <tr
                  key={i}
                  className={row.isSummary ? "tabbed-data-tables__summary" : ""}
                >
                  {row.cells.map((cell, j) => (
                    <td key={j} dangerouslySetInnerHTML={{ __html: cell }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TabbedDataTables;
