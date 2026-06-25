import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBusinessById, resolveImageUrl } from "../api/client";
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
  if (!value) return "vigente esta semana";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "vigente esta semana";
  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function BusinessDetailPage() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);

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
  if (!business) return <p>Cargando oferta...</p>;

  const mapAddress = business.address || business.name;

  return (
    <>
      <article className="detail-card">
        <img src={resolveImageUrl(business.logoUrl)} alt={business.name} className="detail-image" />
        <div className="stack-sm">
          <p className="eyebrow">
            <i className="fas fa-tag" style={{ marginRight: "0.4rem" }} />
            {business.category?.name || "Sin rubro"}
          </p>
          <h2>{business.name}</h2>
          <p>{business.description}</p>
          <div className="offer-detail-price">
            {business.regularPrice ? (
              <span>{formatCurrency(business.regularPrice)}</span>
            ) : null}
            <strong>{formatCurrency(business.salePrice) || "Consultar precio"}</strong>
            <small>
              <i className="fas fa-clock" style={{ marginRight: "0.35rem" }} />
              Oferta hasta el {formatExpiration(business.expiresAt)}
            </small>
          </div>
          {business.phone && (
            <p>
              <i className="fas fa-phone" style={{ marginRight: "0.5rem", color: "var(--accent-teal)" }} />
              <strong>Telefono:</strong> {business.phone}
            </p>
          )}
          {business.address && (
            <div className="location-block">
              <p>
                <i className="fas fa-location-dot" style={{ marginRight: "0.5rem", color: "var(--accent-pink)" }} />
                <strong>Direccion:</strong> {business.address}
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
                Sitio web
              </a>
            )}
          </div>
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

export default BusinessDetailPage;
