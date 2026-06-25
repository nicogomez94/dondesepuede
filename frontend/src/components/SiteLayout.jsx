import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/ofertas",    label: "Ofertas",    icon: "fa-ticket" },
  { to: "/categorias", label: "Rubros", icon: "fa-tags" },
  { to: "/eventos",    label: "Eventos",    icon: "fa-calendar-days" },
  { to: "/contacto",   label: "Contacto",   icon: "fa-envelope" },
];

function SiteLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand-link">
            <p className="eyebrow">
              <i className="fas fa-bolt" style={{ marginRight: "0.35rem" }} />
              San Rafael
            </p>
            <h1 className="brand">
              <i className="fas fa-tags" style={{ marginRight: "0.4rem" }} />
              <span className="brand-location">Ofertas San Rafael</span>
            </h1>
          </Link>
          <button
            type="button"
            className="mobile-nav-toggle"
            aria-label={isMobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <i className={`fas ${isMobileMenuOpen ? "fa-xmark" : "fa-bars"}`} />
          </button>

          <nav className={`nav ${isMobileMenuOpen ? "mobile-open" : ""}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                onClick={closeMobileMenu}
              >
                <i className={`fas ${item.icon}`} style={{ marginRight: "0.35rem" }} />
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/admin" className="nav-link admin-link" onClick={closeMobileMenu}>
              <i className="fas fa-sliders" style={{ marginRight: "0.35rem" }} />
              Admin
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container page-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">

          {/* Marca */}
          <div className="footer-col">
            <Link to="/" className="footer-brand">
              <i className="fas fa-ticket" />
              Ofertas San Rafael
            </Link>
            <p className="footer-desc">
              Ofertas activas de comercios de San Rafael, ordenadas por rubro y vigencia.
            </p>
          </div>

          {/* Links rápidos */}
          <div className="footer-col">
            <h4 className="footer-heading">
              <i className="fas fa-compass" style={{ marginRight: "0.4rem" }} />
              Explorar
            </h4>
            <ul className="footer-links">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>
                    <i className={`fas ${item.icon}`} style={{ marginRight: "0.4rem" }} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="footer-col">
            <h4 className="footer-heading">
              <i className="fas fa-phone" style={{ marginRight: "0.4rem" }} />
              Contacto
            </h4>
            <ul className="footer-links">
              <li>
                <i className="fas fa-location-dot" style={{ marginRight: "0.4rem" }} />
                San Rafael, Mendoza
              </li>
              <li>
                <i className="fas fa-envelope" style={{ marginRight: "0.4rem" }} />
                email@ejemplo.com
              </li>
              <li>
                <i className="fas fa-phone" style={{ marginRight: "0.4rem" }} />
                +54 000 000-0000
              </li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Ofertas San Rafael. Todos los derechos reservados.
            {" "}Hecho por{" "}
            <a href="https://zigodev.com.ar" target="_blank" rel="noopener noreferrer">
              zigodev
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default SiteLayout;
