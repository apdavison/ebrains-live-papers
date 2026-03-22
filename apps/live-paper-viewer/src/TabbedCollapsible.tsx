import { useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Tabs from "./components/Tabs";
import Collapsible from "./components/Collapsible";
import WidgetRenderer from "./WidgetRenderer";
import type { TabbedCollapsibleConfig, LivePaperDataItem } from "./types";
import "./TabbedCollapsible.css";

function TabbedCollapsible({ config }: { config: TabbedCollapsibleConfig }) {
  const [activeTab, setActiveTab] = useState(config.tabs[0]?.id ?? "");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const currentTab = config.tabs.find((t) => t.id === activeTab);

  return (
    <div className="tabbed-collapsible">
      {config.introText && (
        <Markdown rehypePlugins={[rehypeRaw]}>{config.introText}</Markdown>
      )}
      <Tabs
        tabs={config.tabs.map((t) => ({ id: t.id, label: t.label }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="tabbed-collapsible-content">
        {currentTab?.items.map((item) => (
          <Collapsible
            key={item.id}
            isOpen={openItems.has(item.id)}
            onToggle={() => toggleItem(item.id)}
            header={<span className="collapsible-label">{item.label}</span>}
          >
            {item.children.map((child: LivePaperDataItem) => (
              <WidgetRenderer key={child.identifier} item={child} />
            ))}
          </Collapsible>
        ))}
      </div>
    </div>
  );
}

export default TabbedCollapsible;
