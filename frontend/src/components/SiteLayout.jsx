import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/eventos",    label: "Eventos",    icon: "fa-calendar-days" },
  { to: "/categorias", label: "Categorias", icon: "fa-tags" },
  { to: "/comercios",  label: "Comercios",  icon: "fa-store" },
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
              <i className="fas fa-building-columns" style={{ marginRight: "0.35rem" }} />
              Camara de Comercio
            </p>
            <h1 className="brand">
              <i className="fas fa-umbrella-beach" style={{ marginRight: "0.4rem" }} />
              <span className="brand-prefix">Guia Comercial — </span>
              <span className="brand-location">Paso de la Patria</span>
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
            <NavLink to="/admin/login" className="nav-link admin-link" onClick={closeMobileMenu}>
              <i className="fas fa-lock" style={{ marginRight: "0.35rem" }} />
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
              <i className="fas fa-umbrella-beach" />
              Guia Comercial
            </Link>
            <p className="footer-desc">
              Conectando vecinos y negocios de Paso de la Patria, Corrientes.
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
                Dirección, Paso de la Patria
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
            © {new Date().getFullYear()} Cámara de Comercio Local — Paso de la Patria. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default SiteLayout;
