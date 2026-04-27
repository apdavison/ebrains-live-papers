import "./Header.css";

function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="/" className="site-header-brand">
          <img
            src="/imgs/ebrains_logo_color.svg"
            alt="EBRAINS"
            className="site-header-logo"
          />
          <span className="site-header-title">Live Papers</span>
        </a>
      </div>
    </header>
  );
}

export default Header;
