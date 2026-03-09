import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBusinesses, fetchCategories } from "../api/client";
import BusinessCard from "../components/BusinessCard";

// ─── Slideshow images ───────────────────────────────────────────────────────
// Reemplaza estas URLs con fotos reales de Paso de la Patria, Corrientes
const SLIDES = [
  {
    url: "https://static.wixstatic.com/media/2fd7fb_c14ebb38ad7d4a9dbbdf49799592b700~mv2.jpg/v1/fill/w_568,h_374,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/2fd7fb_c14ebb38ad7d4a9dbbdf49799592b700~mv2.jpg",
    caption: "Costa del Rio Paraná — Paso de la Patria",
  },
  {
    url: "https://picsum.photos/seed/bella-vista-plaza/1400/500",
    caption: "Plaza Principal — Paso de la Patria",
  },
  {
    url: "https://picsum.photos/seed/bella-vista-centro/1400/500",
    caption: "Centro Comercial — Paso de la Patria",
  },
  {
    url: "https://picsum.photos/seed/bella-vista-turismo/1400/500",
    caption: "Turismo Local — Corrientes",
  },
  {
    url: "https://picsum.photos/seed/bella-vista-atardecer/1400/500",
    caption: "Atardecer — Paso de la Patria, Corrientes",
  },
];

const INTERVAL_MS = 4500;

// ─── Category meta ───────────────────────────────────────────────────────────
const CATEGORY_META = {
  gastronomia:  { icon: "fa-utensils",    seed: "food-restaurant", color: "#ff6b35" },
  comercios:    { icon: "fa-bag-shopping", seed: "shopping-market", color: "#ec4899" },
  alojamientos: { icon: "fa-hotel",        seed: "hotel-lobby",     color: "#7c3aed" },
  servicios:    { icon: "fa-screwdriver-wrench", seed: "business-office", color: "#0ea5e9" },
};

const FALLBACK_META = [
  { icon: "fa-store",        seed: "shop-store",  color: "#10b981" },
  { icon: "fa-star",         seed: "city-street", color: "#fbbf24" },
  { icon: "fa-bullseye",     seed: "work-team",   color: "#f43f5e" },
  { icon: "fa-rocket",       seed: "modern-city", color: "#6366f1" },
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

// ─── Hero Slideshow ──────────────────────────────────────────────────────────
function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = (index) => {
    setCurrent((index + SLIDES.length) % SLIDES.length);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), INTERVAL_MS);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleArrow = (dir) => {
    goTo(current + dir);
    resetTimer();
  };

  const handleDot = (i) => {
    goTo(i);
    resetTimer();
  };

  return (
    <div className="hero-slideshow">
      {SLIDES.map((slide, i) => (
        <img
          key={i}
          src={slide.url}
          alt={slide.caption}
          className={`hero-slide${i === current ? " active" : ""}`}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
      <div className="hero-overlay" />

      <div className="hero-arrows">
        <button className="hero-arrow" onClick={() => handleArrow(-1)} aria-label="Anterior">
          <i className="fas fa-chevron-left" />
        </button>
        <button className="hero-arrow" onClick={() => handleArrow(1)} aria-label="Siguiente">
          <i className="fas fa-chevron-right" />
        </button>
      </div>

      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hero-dot${i === current ? " active" : ""}`}
            onClick={() => handleDot(i)}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
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
        <HeroSlideshow />

        {/* LOGOS PANEL */}
        <div className="hero-logos">
          <div className="hero-logo-wrap">
            <img src="/logo1.png" alt="Cámara de Comercio Turismo, Industria y Producción — Paso de la Patria" />
          </div>
          <div className="hero-logos-divider" />
          <div className="hero-logo-wrap">
            <img src="/logo2.avif" alt="El Paso — Turismo Todo el Año" />
          </div>
        </div>

        <div className="hero-content">
          <p className="eyebrow">
            <i className="fas fa-location-dot" style={{ marginRight: "0.4rem" }} />
            Paso de la Patria, Corrientes
          </p>
          <h2>Conecta con los comercios de tu ciudad desde un solo lugar</h2>
          <p>
            La Camara de Comercio impulsa el desarrollo local con esta guia
            comercial digital para vecinos, turistas y empresas.
          </p>
          <Link to="/comercios" className="button-link">
            <i className="fas fa-map" style={{ marginRight: "0.5rem" }} />
            Explorar comercios
          </Link>
        </div>

        {/* <div className="stats-box">
          <p>
            <i className="fas fa-layer-group" style={{ marginRight: "0.3rem" }} />
            Total categorias
          </p>
          <strong>{categories.length}</strong>
          <p>
            <i className="fas fa-store" style={{ marginRight: "0.3rem" }} />
            Comercios destacados
          </p>
          <strong>{businesses.length}</strong>
        </div> */}
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* CATEGORIES */}
      <section className="stack-md">
        <h3>
          <i className="fas fa-tags" style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
          Categorias principales
        </h3>
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
                  <i
                    className={`fas ${meta.icon} card-icon`}
                    style={{ color: meta.color }}
                  />
                  <h4>{category.name}</h4>
                  <p>{category._count?.businesses || 0} comercios registrados</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* BANNER */}
      <img
        src="https://i.ytimg.com/vi/rOwuH0ruxWc/maxresdefault.jpg"
        alt="Comercios locales de Paso de la Patria"
        className="section-banner"
        loading="lazy"
      />

      {/* FEATURED BUSINESSES */}
      <section className="stack-md">
        <h3>
          <i className="fas fa-star" style={{ marginRight: "0.5rem", color: "var(--accent-yellow)" }} />
          Comercios destacados
        </h3>
        <div className="business-grid">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link to="/comercios" className="button-link">
            Ver todos los comercios
            <i className="fas fa-arrow-right" style={{ marginLeft: "0.5rem" }} />
          </Link>
        </div>
      </section>
    </section>
  );
}

export default HomePage;
