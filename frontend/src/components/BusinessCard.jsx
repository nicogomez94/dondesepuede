import { Link } from "react-router-dom";
import { resolveImageUrl } from "../api/client";

function BusinessCard({ business }) {
  return (
    <article className="business-card">
      <img
        src={resolveImageUrl(business.logoUrl)}
        alt={business.name}
        className="business-card-image"
        loading="lazy"
      />
      <div className="business-card-body">
        <h3>{business.name}</h3>
        <p className="category-tag">{business.category?.name || "Sin categoria"}</p>
        <p>{business.description}</p>
        {business.phone && <p className="contact-line">Telefono: {business.phone}</p>}
        <div className="social-links">
          {business.instagram && (
            <a href={business.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
          {business.facebook && (
            <a href={business.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
          )}
          {business.website && (
            <a href={business.website} target="_blank" rel="noreferrer">
              Web
            </a>
          )}
        </div>
        <Link to={`/comercios/${business.id}`} className="button-link">
          Ver detalle
        </Link>
      </div>
    </article>
  );
}

export default BusinessCard;
