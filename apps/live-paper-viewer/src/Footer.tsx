import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <img src="/imgs/eu_flag.svg" alt="European Union flag" className="site-footer-eu-flag" />
        <span className="site-footer-eu-text">Co-funded by the European Union</span>
      </div>
    </footer>
  );
}

export default Footer;
