import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/",          label: "Inicio" },
  { to: "/categorias", label: "Categorias" },
  { to: "/comercios",  label: "Comercios" },
  { to: "/contacto",   label: "Contacto" },
];

function SiteLayout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <div>
            <p className="eyebrow">Camara de Comercio</p>
            <h1 className="brand">🏘️ Guia Comercial de la Ciudad</h1>
          </div>
          <nav className="nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/admin/login" className="nav-link admin-link">
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
          <p>🌟 Camara de Comercio Local — Directorio de Comercios 🌟</p>
          <p style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "0.4rem" }}>
            Conectando vecinos y negocios de nuestra ciudad
          </p>
        </div>
      </footer>
    </div>
  );
}

export default SiteLayout;
