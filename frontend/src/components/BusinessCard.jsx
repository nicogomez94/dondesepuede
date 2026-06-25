import { useState } from "react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../api/client";
import { buildGoogleMapsEmbedUrl, buildGoogleMapsSearchUrl } from "../utils/maps";

function formatCurrency(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(number);
}

function formatExpiration(value) {
  if (!value) return "Esta semana";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Esta semana";
  return date.toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
}

function getDiscountPercent(regularPrice, salePrice) {
  const regular = Number(regularPrice);
  const sale = Number(salePrice);
  if (!regular || !sale || sale >= regular) return null;
  return Math.round(((regular - sale) / regular) * 100);
}

function BusinessCard({ business }) {
  const [showMap, setShowMap] = useState(false);
  const mapAddress = business.address || business.name;
  const discountPercent = getDiscountPercent(business.regularPrice, business.salePrice);

  return (
    <>
      <article className="business-card">
        <div className="offer-image-wrap">
          <img
            src={resolveImageUrl(business.logoUrl)}
            alt={business.name}
            className="business-card-image"
            loading="lazy"
          />
          {discountPercent ? (
            <span className="offer-discount-badge">{discountPercent}% OFF</span>
          ) : null}
        </div>
        <div className="business-card-body">
          <div className="offer-card-heading">
            <p className="category-tag">
              <i className="fas fa-tag" style={{ marginRight: "0.35rem" }} />
              {business.category?.name || "Sin rubro"}
            </p>
            <span className="offer-expiration">
              <i className="fas fa-clock" style={{ marginRight: "0.3rem" }} />
              Hasta {formatExpiration(business.expiresAt)}
            </span>
          </div>
          <h3>{business.name}</h3>
          <p>{business.description}</p>
          <div className="offer-price-row">
            {business.regularPrice ? (
              <span className="offer-old-price">{formatCurrency(business.regularPrice)}</span>
            ) : null}
            <strong>{formatCurrency(business.salePrice) || "Consultar precio"}</strong>
          </div>
          {business.phone && (
            <p className="contact-line">
              <i className="fas fa-phone" style={{ marginRight: "0.4rem", color: "var(--accent-teal)" }} />
              {business.phone}
            </p>
          )}
          {business.address && (
            <div className="location-block">
              <p className="contact-line">
                <i className="fas fa-location-dot" style={{ marginRight: "0.4rem", color: "var(--accent-pink)" }} />
                {business.address}
              </p>
              <button type="button" className="map-inline-button" onClick={() => setShowMap(true)}>
                <i className="fas fa-map-location-dot" style={{ marginRight: "0.35rem" }} />
                Ver mapa
              </button>
            </div>
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
          <Link to={`/ofertas/${business.id}`} className="button-link">
            <i className="fas fa-ticket" style={{ marginRight: "0.45rem" }} />
            Ver oferta
          </Link>
        </div>
      </article>

      {showMap && (
        <div className="modal-backdrop" onClick={() => setShowMap(false)}>
          <div className="modal-box map-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowMap(false)} aria-label="Cerrar">
              <i className="fas fa-xmark" />
            </button>
            <div className="map-modal-content">
              <h3>Como llegar al comercio</h3>
              <p>{mapAddress}</p>
              <iframe
                title={`Mapa de ${business.name}`}
                src={buildGoogleMapsEmbedUrl(mapAddress)}
                className="map-iframe"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                className="button-link"
                href={buildGoogleMapsSearchUrl(mapAddress)}
                target="_blank"
                rel="noreferrer"
              >
                <i className="fas fa-arrow-up-right-from-square" style={{ marginRight: "0.35rem" }} />
                Abrir en Google Maps
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BusinessCard;
