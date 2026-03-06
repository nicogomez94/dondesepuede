import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBusinessById, resolveImageUrl } from "../api/client";

function BusinessDetailPage() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBusiness() {
      try {
        setBusiness(await fetchBusinessById(id));
      } catch (e) {
        setError(e.message);
      }
    }
    loadBusiness();
  }, [id]);

  if (error) return <p className="error-message">{error}</p>;
  if (!business) return <p>Cargando detalle...</p>;

  return (
    <article className="detail-card">
      <img src={resolveImageUrl(business.logoUrl)} alt={business.name} className="detail-image" />
      <div className="stack-sm">
        <p className="eyebrow">
          <i className="fas fa-tag" style={{ marginRight: "0.4rem" }} />
          {business.category?.name || "Sin categoria"}
        </p>
        <h2>{business.name}</h2>
        <p>{business.description}</p>
        {business.phone && (
          <p>
            <i className="fas fa-phone" style={{ marginRight: "0.5rem", color: "var(--accent-teal)" }} />
            <strong>Telefono:</strong> {business.phone}
          </p>
        )}
        {business.address && (
          <p>
            <i className="fas fa-location-dot" style={{ marginRight: "0.5rem", color: "var(--accent-pink)" }} />
            <strong>Direccion:</strong> {business.address}
          </p>
        )}
        <div className="social-links">
          {business.instagram && (
            <a href={business.instagram} target="_blank" rel="noreferrer">
              <i className="fab fa-instagram" style={{ marginRight: "0.3rem" }} />
              Instagram
            </a>
          )}
          {business.facebook && (
            <a href={business.facebook} target="_blank" rel="noreferrer">
              <i className="fab fa-facebook" style={{ marginRight: "0.3rem" }} />
              Facebook
            </a>
          )}
          {business.website && (
            <a href={business.website} target="_blank" rel="noreferrer">
              <i className="fas fa-globe" style={{ marginRight: "0.3rem" }} />
              Sitio web
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default BusinessDetailPage;
