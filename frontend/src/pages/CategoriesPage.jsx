import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories, resolveImageUrl } from "../api/client";

const CATEGORY_META = {
  gastronomia:  { icon: "fa-utensils",         seed: "food-restaurant", color: "#8b6f5a" },
  comercios:    { icon: "fa-bag-shopping",       seed: "shopping-market", color: "#31584c" },
  alojamientos: { icon: "fa-hotel",             seed: "hotel-lobby",     color: "#6f766f" },
  servicios:    { icon: "fa-screwdriver-wrench", seed: "business-office", color: "#4f6f72" },
};

const FALLBACK_META = [
  { icon: "fa-store",    seed: "shop-store",  color: "#5f725f" },
  { icon: "fa-star",     seed: "city-street", color: "#9b865c" },
  { icon: "fa-bullseye", seed: "work-team",   color: "#6f766f" },
  { icon: "fa-rocket",   seed: "modern-city", color: "#31584c" },
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

function getCategoryImageUrl(category) {
  return category?.imageUrl || category?.image_url || "";
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
      <div className="banner-wrap">
        <img
          src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1500&q=80"
          alt="Categorias de comercios"
          className="section-banner"
          loading="lazy"
        />
        <div className="banner-overlay">
          <h1>Rubros disponibles</h1>
          <p>Explora categorias pensadas para encontrar comercios, profesionales y servicios con facilidad.</p>
        </div>
      </div>

      <div>
        <h2>
          <i className="fas fa-tags" style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
          Categorias Destacadas
        </h2>
        <p>Descubri los rubros disponibles para encontrar lo que buscas rapido y facil.</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="category-grid">
        {categories.map((category, i) => {
          const meta = getCategoryMeta(category.name, i);
          const categoryImage = getCategoryImageUrl(category);
          return (
            <article
              key={category.id}
              className="simple-card"
              style={{ borderTopColor: meta.color, borderTopWidth: 4 }}
            >
              {categoryImage ? (
                <img
                  src={resolveImageUrl(categoryImage)}
                  alt={category.name}
                  className="simple-card-image"
                  loading="lazy"
                />
              ) : (
                <div
                  className="simple-card-image simple-card-placeholder"
                  style={{ background: `linear-gradient(135deg, ${meta.color}22, ${meta.color}55)` }}
                >
                  <i className={`fas ${meta.icon}`} style={{ color: meta.color }} />
                </div>
              )}
              <div className="simple-card-body">
                <i
                  className={`fas ${meta.icon} card-icon`}
                  style={{ color: meta.color }}
                />
                <h3>{category.name}</h3>
                <p>{category._count?.businesses || 0} comercios</p>
                <Link
                  to={`/comercios?category=${category.id}`}
                  className="button-link"
                  style={{ background: meta.color }}
                >
                  <i className="fas fa-arrow-right" style={{ marginRight: "0.4rem" }} />
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
