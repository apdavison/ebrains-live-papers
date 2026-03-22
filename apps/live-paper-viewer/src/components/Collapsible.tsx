import type { ReactNode } from "react";
import "./Collapsible.css";

interface CollapsibleProps {
  header: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function Collapsible({ header, children, isOpen, onToggle }: CollapsibleProps) {
  return (
    <div className={`collapsible-item${isOpen ? " active" : ""}`}>
      <div
        className="collapsible-header"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <i className="material-icons collapsible-arrow">
          {isOpen ? "expand_more" : "chevron_right"}
        </i>
        {header}
      </div>
      {isOpen && <div className="collapsible-body">{children}</div>}
    </div>
  );
}

export default Collapsible;
