import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchBusinesses, fetchCategories } from "../api/client";
import BusinessCard from "../components/BusinessCard";

function BusinessesPage() {
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
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

  const onFilterSubmit = (event) => {
    event.preventDefault();
    const nextParams = {};
    if (search.trim()) nextParams.search = search.trim();
    if (categoryId) nextParams.category = categoryId;
    setSearchParams(nextParams);
  };

  return (
    <section className="stack-md">
      <img
        src="https://picsum.photos/seed/local-shops/1100/220"
        alt="Comercios locales"
        className="section-banner"
        loading="lazy"
      />
      <h2>🛒 Listado de comercios</h2>
      <form className="filters" onSubmit={onFilterSubmit}>
        <label>
          Buscar por nombre
          <input
            type="search"
            placeholder="Ej: Panaderia"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label>
          Filtrar por categoria
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
          Aplicar
        </button>
      </form>

      {loading && <p>Cargando comercios...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !businesses.length ? (
        <p>No se encontraron comercios con los filtros seleccionados.</p>
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
