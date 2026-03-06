import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBusinesses, fetchCategories } from "../api/client";
import BusinessCard from "../components/BusinessCard";

// Mapping by normalized category name → emoji + picsum image seed + accent color
const CATEGORY_META = {
  gastronomia:  { emoji: "🍽️", seed: "food-restaurant", color: "#ff6b35" },
  comercios:    { emoji: "🛍️", seed: "shopping-market",  color: "#ec4899" },
  alojamientos: { emoji: "🏨", seed: "hotel-lobby",      color: "#7c3aed" },
  servicios:    { emoji: "⚙️", seed: "business-office",  color: "#0ea5e9" },
};

const FALLBACK_META = [
  { emoji: "🏪", seed: "shop-store",   color: "#10b981" },
  { emoji: "🌟", seed: "city-street",  color: "#fbbf24" },
  { emoji: "🎯", seed: "work-team",    color: "#f43f5e" },
  { emoji: "🚀", seed: "modern-city",  color: "#6366f1" },
];

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function getCategoryMeta(name, fallbackIndex) {
  return CATEGORY_META[normalize(name)] || FALLBACK_META[fallbackIndex % FALLBACK_META.length];
}

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
      {/* HERO */}
      <div className="hero">
        <div>
          <p className="eyebrow">Ciudad activa y productiva</p>
          <h2>Conecta con los comercios de tu ciudad desde un solo lugar</h2>
          <p>
            La Camara de Comercio impulsa el desarrollo local con esta guia
            comercial digital para vecinos, turistas y empresas.
          </p>
          <Link to="/comercios" className="button-link">
            🗺️ Explorar comercios
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

      {/* CATEGORIES SECTION */}
      <section className="stack-md">
        <h3>🏷️ Categorias principales</h3>
        <div className="category-grid">
          {categories.map((category, i) => {
            const meta = getCategoryMeta(category.name, i);
            return (
              <article
                key={category.id}
                className="simple-card"
                style={{ borderTopColor: meta.color, borderTopWidth: 4 }}
              >
                <img
                  src={`https://picsum.photos/seed/${meta.seed}/400/150`}
                  alt={category.name}
                  className="simple-card-image"
                  loading="lazy"
                />
                <div className="simple-card-body">
                  <span className="card-emoji">{meta.emoji}</span>
                  <h4>{category.name}</h4>
                  <p>{category._count?.businesses || 0} comercios registrados</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* BANNER IMAGE */}
      <img
        src="https://picsum.photos/seed/townfestival/1100/220"
        alt="Comercios locales"
        className="section-banner"
        loading="lazy"
      />

      {/* FEATURED BUSINESSES SECTION */}
      <section className="stack-md">
        <h3>⭐ Comercios destacados</h3>
        <div className="business-grid">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link to="/comercios" className="button-link">
            Ver todos los comercios →
          </Link>
        </div>
      </section>
    </section>
  );
}

export default HomePage;
