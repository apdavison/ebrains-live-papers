import "./Tabs.css";

export interface TabDefinition {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabDefinition[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="tabs-wrapper">
      <ul className="tabs">
        {tabs.map((tab) => (
          <li key={tab.id} className="tab">
            <a
              href={`#${tab.id}`}
              className={activeTab === tab.id ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                onTabChange(tab.id);
              }}
            >
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tabs;
