import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../api/client";

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
      <h2>Categorias comerciales</h2>
      <p>Descubre los rubros disponibles para encontrar lo que buscas rapidamente.</p>
      {error && <p className="error-message">{error}</p>}
      <div className="category-grid">
        {categories.map((category) => (
          <article key={category.id} className="simple-card">
            <h3>{category.name}</h3>
            <p>{category._count?.businesses || 0} comercios</p>
            <Link to={`/comercios?category=${category.id}`} className="button-link">
              Ver comercios
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CategoriesPage;
