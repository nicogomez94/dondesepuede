import { Link, NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/eventos",    label: "Eventos",    icon: "fa-calendar-days" },
  { to: "/categorias", label: "Categorias", icon: "fa-tags" },
  { to: "/comercios",  label: "Comercios",  icon: "fa-store" },
  { to: "/contacto",   label: "Contacto",   icon: "fa-envelope" },
];

function SiteLayout() {
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
              Guia Comercial — Paso de la Patria
            </h1>
          </Link>
          <nav className="nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <i className={`fas ${item.icon}`} style={{ marginRight: "0.35rem" }} />
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/admin/login" className="nav-link admin-link">
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
        <div className="container">
          <p>
            <i className="fas fa-star" style={{ marginRight: "0.35rem", color: "var(--accent-yellow)" }} />
            Camara de Comercio Local — Paso de la Patria, Corrientes
            <i className="fas fa-star" style={{ marginLeft: "0.35rem", color: "var(--accent-yellow)" }} />
          </p>
          <p style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "0.4rem" }}>
            <i className="fas fa-heart" style={{ marginRight: "0.35rem", color: "#ec4899" }} />
            Conectando vecinos y negocios de nuestra ciudad
          </p>
        </div>
      </footer>
    </div>
  );
}

export default SiteLayout;
