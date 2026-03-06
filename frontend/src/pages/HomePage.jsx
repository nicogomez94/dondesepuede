import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBusinesses, fetchCategories } from "../api/client";
import BusinessCard from "../components/BusinessCard";

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesData, businessesData] = await Promise.all([
          fetchCategories(),
          fetchBusinesses(),
        ]);
        setCategories(categoriesData);
        setBusinesses(businessesData.slice(0, 3));
      } catch (e) {
        setError(e.message);
      }
    }

    loadData();
  }, []);

  return (
    <section className="stack-lg">
      <div className="hero">
        <div>
          <p className="eyebrow">Ciudad activa y productiva</p>
          <h2>Conecta con comercios locales desde un solo lugar</h2>
          <p>
            La Camara de Comercio impulsa el desarrollo local con esta guia comercial
            digital para vecinos, turistas y empresas.
          </p>
          <Link to="/comercios" className="button-link">
            Explorar comercios
          </Link>
        </div>
        <div className="stats-box">
          <p>Total categorias</p>
          <strong>{categories.length}</strong>
          <p>Comercios destacados</p>
          <strong>{businesses.length}</strong>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <section className="stack-md">
        <h3>Categorias principales</h3>
        <div className="category-grid">
          {categories.map((category) => (
            <article key={category.id} className="simple-card">
              <h4>{category.name}</h4>
              <p>{category._count?.businesses || 0} comercios registrados</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stack-md">
        <h3>Comercios destacados</h3>
        <div className="business-grid">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </section>
    </section>
  );
}

export default HomePage;
