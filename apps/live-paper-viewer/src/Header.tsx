import { Link } from "react-router";
import "./Header.css";

function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-header-brand">
          <a href="https://ebrains.eu" target="_blank" rel="noreferrer">
            <img
              src="/imgs/ebrains_logo_color.svg"
              alt="EBRAINS"
              className="site-header-logo"
            />
          </a>
          <a href="/" className="site-header-title">Live Papers</a>
        </div>
        <nav className="site-header-nav">
          <Link to="/docs">About</Link>
          <a href="https://live-papers.apps.ebrains.eu/builder" target="_blank" rel="noreferrer">Publish</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
