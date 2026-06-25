import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchBusinesses, fetchCategories } from "../api/client";
import BusinessCard from "../components/BusinessCard";

const OFFER_BANNER_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80",
    title: "Feed de ofertas activas",
    text: "Promociones publicadas por comercios locales, visibles solo mientras sigan vigentes.",
  },
  {
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80",
    title: "Promos frescas cada semana",
    text: "Panaderias, almacenes, cafeterias y servicios con precios cargados por los comercios.",
  },
  {
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
    title: "Ahorra y llega facil",
    text: "Filtra por rubro, mira el precio de oferta y abri el mapa para ir directo al local.",
  },
  {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    title: "Ofertas San Rafael",
    text: "Un lugar simple para encontrar oportunidades reales cerca tuyo.",
  },
];

function BusinessesPage() {
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("category") || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    async function loadBusinesses() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchBusinesses({ search, categoryId });
        setBusinesses(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadBusinesses();
  }, [search, categoryId]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentSlide((slide) => (slide + 1) % OFFER_BANNER_SLIDES.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, []);

  const onFilterSubmit = (event) => {
    event.preventDefault();
    const nextParams = {};
    if (search.trim()) nextParams.search = search.trim();
    if (categoryId) nextParams.category = categoryId;
    setSearchParams(nextParams);
  };

  return (
    <section className="stack-md">
      <div className="banner-wrap offer-banner-slideshow">
        {OFFER_BANNER_SLIDES.map((slide, index) => (
          <img
            key={slide.title}
            src={slide.image}
            alt={slide.title}
            className={`section-banner offer-banner-slide${index === currentSlide ? " active" : ""}`}
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}
        <div className="banner-overlay offer-banner-overlay">
          <p className="eyebrow">
            <i className="fas fa-bolt" style={{ marginRight: "0.35rem" }} />
            Ofertas San Rafael
          </p>
          <h1>{OFFER_BANNER_SLIDES[currentSlide].title}</h1>
          <p>{OFFER_BANNER_SLIDES[currentSlide].text}</p>
          <div className="offer-banner-dots" aria-label="Slides de ofertas">
            {OFFER_BANNER_SLIDES.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                className={`offer-banner-dot${index === currentSlide ? " active" : ""}`}
                aria-label={`Ver slide ${index + 1}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <h2>
        <i className="fas fa-ticket" style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
        Ofertas de la semana
      </h2>
      <form className="filters" onSubmit={onFilterSubmit}>
        <label>
          Buscar oferta o negocio
          <input
            type="search"
            placeholder="Ej: Panaderia, cafe, ferreteria"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label>
          Filtrar por rubro
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="button-link">
          <i className="fas fa-magnifying-glass" style={{ marginRight: "0.4rem" }} />
          Buscar
        </button>
      </form>

      {loading && <p>Cargando ofertas...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !businesses.length ? (
        <p>No se encontraron ofertas activas con los filtros seleccionados.</p>
      ) : (
        <div className="business-grid">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </section>
  );
}

export default BusinessesPage;
