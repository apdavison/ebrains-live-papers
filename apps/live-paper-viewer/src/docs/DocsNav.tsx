import { NavLink } from "react-router";
import "./docs.css";

const LINKS = [
  { to: "/docs", label: "Introduction", end: true },
  { to: "/docs/find", label: "Find" },
  { to: "/docs/create", label: "Create" },
  { to: "/docs/develop", label: "Develop" },
  { to: "/docs/tutorial", label: "Tutorial" },
  { to: "/docs/credits", label: "Credits" },
];

export default function DocsNav() {
  return (
    <nav className="docs-nav">
      <div className="docs-nav-inner">
        {LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              "docs-nav-link" + (isActive ? " active" : "")
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
