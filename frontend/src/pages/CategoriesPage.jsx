import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../api/client";

const CATEGORY_META = {
  gastronomia:  { emoji: "🍽️", seed: "food-restaurant", color: "#ff6b35" },
  comercios:    { emoji: "🛍️", seed: "shopping-market",  color: "#ec4899" },
  alojamientos: { emoji: "🏨", seed: "hotel-lobby",      color: "#7c3aed" },
  servicios:    { emoji: "⚙️", seed: "business-office",  color: "#0ea5e9" },
};

const FALLBACK_META = [
  { emoji: "🏪", seed: "shop-store",  color: "#10b981" },
  { emoji: "🌟", seed: "city-street", color: "#fbbf24" },
  { emoji: "🎯", seed: "work-team",   color: "#f43f5e" },
  { emoji: "🚀", seed: "modern-city", color: "#6366f1" },
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

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategories(await fetchCategories());
      } catch (e) {
        setError(e.message);
      }
    }
    loadCategories();
  }, []);

  return (
    <section className="stack-md">
      <img
        src="https://picsum.photos/seed/marketplace-city/1100/220"
        alt="Categorias de comercios"
        className="section-banner"
        loading="lazy"
      />

      <div>
        <h2>🏷️ Categorias comerciales</h2>
        <p>Descubri los rubros disponibles para encontrar lo que buscas rapido y facil.</p>
      </div>

      {error && <p className="error-message">{error}</p>}

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
                <h3>{category.name}</h3>
                <p>{category._count?.businesses || 0} comercios</p>
                <Link
                  to={`/comercios?category=${category.id}`}
                  className="button-link"
                  style={{
                    background: `linear-gradient(135deg, ${meta.color}, #ec4899)`,
                  }}
                >
                  Ver comercios
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default CategoriesPage;
