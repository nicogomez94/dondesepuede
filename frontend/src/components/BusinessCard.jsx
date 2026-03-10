import { useState } from "react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../api/client";
import { buildGoogleMapsEmbedUrl, buildGoogleMapsSearchUrl } from "../utils/maps";

function BusinessCard({ business }) {
  const [showMap, setShowMap] = useState(false);
  const mapAddress = business.address || business.name;

  return (
    <>
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
          <Link to={`/comercios/${business.id}`} className="button-link">
            <i className="fas fa-circle-info" style={{ marginRight: "0.45rem" }} />
            Ver detalle
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
              <h3>Ubicacion en el mapa</h3>
              <p>{mapAddress}, Paso de la Patria, Corrientes</p>
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
