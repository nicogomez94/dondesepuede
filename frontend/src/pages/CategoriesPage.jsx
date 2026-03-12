import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories, resolveImageUrl } from "../api/client";

const CATEGORY_META = {
  gastronomia:  { icon: "fa-utensils",         seed: "food-restaurant", color: "#ff6b35" },
  comercios:    { icon: "fa-bag-shopping",       seed: "shopping-market", color: "#ec4899" },
  alojamientos: { icon: "fa-hotel",             seed: "hotel-lobby",     color: "#7c3aed" },
  servicios:    { icon: "fa-screwdriver-wrench", seed: "business-office", color: "#0ea5e9" },
};

const FALLBACK_META = [
  { icon: "fa-store",    seed: "shop-store",  color: "#10b981" },
  { icon: "fa-star",     seed: "city-street", color: "#fbbf24" },
  { icon: "fa-bullseye", seed: "work-team",   color: "#f43f5e" },
  { icon: "fa-rocket",   seed: "modern-city", color: "#6366f1" },
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
          src="/otro.jpg"
          alt="Categorias de comercios — Paso de la Patria"
          className="section-banner"
          loading="lazy"
        />
        <div className="banner-overlay">
          <h1>Rubros de nuestra ciudad</h1>
          <p>Explorá la variedad de servicios y comercios que hacen a la vida en Paso de la Patria, Corrientes.</p>
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
              <img
                src={categoryImage ? resolveImageUrl(categoryImage) : `https://picsum.photos/seed/${meta.seed}/400/150`}
                alt={category.name}
                className="simple-card-image"
                loading="lazy"
              />
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
                  style={{ background: `linear-gradient(135deg, ${meta.color}, #ec4899)` }}
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
