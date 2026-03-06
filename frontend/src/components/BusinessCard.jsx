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
        <p className="category-tag">
          <i className="fas fa-tag" style={{ marginRight: "0.35rem" }} />
          {business.category?.name || "Sin categoria"}
        </p>
        <p>{business.description}</p>
        {business.phone && (
          <p className="contact-line">
            <i className="fas fa-phone" style={{ marginRight: "0.4rem", color: "var(--accent-teal)" }} />
            {business.phone}
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
              Web
            </a>
          )}
        </div>
        <Link to={`/comercios/${business.id}`} className="button-link">
          <i className="fas fa-circle-info" style={{ marginRight: "0.45rem" }} />
          Ver detalle
        </Link>
      </div>
    </article>
  );
}

export default BusinessCard;
