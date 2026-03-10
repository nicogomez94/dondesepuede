import { useState } from "react";
import { resolveImageUrl } from "../api/client";
import { buildGoogleMapsEmbedUrl, buildGoogleMapsSearchUrl } from "../utils/maps";

const DATE_FORMATTER = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "full",
  timeStyle: "short",
});

function formatEventDate(startsAt, endsAt) {
  const start = new Date(startsAt);
  const end = endsAt ? new Date(endsAt) : null;

  if (!end) {
    return DATE_FORMATTER.format(start);
  }

  const sameDay = start.toDateString() === end.toDateString();

  if (sameDay) {
    return `${DATE_FORMATTER.format(start)} hasta las ${end.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return `${DATE_FORMATTER.format(start)} - ${DATE_FORMATTER.format(end)}`;
}

function EventCard({ event }) {
  const [showMap, setShowMap] = useState(false);
  const mapAddress = event.location || event.title;

  return (
    <>
      <article className="event-card">
        <img
          src={resolveImageUrl(event.imageUrl)}
          alt={event.title}
          className="event-card-image"
          loading="lazy"
        />
        <div className="event-card-body">
          <p className="event-date-badge">
            <i className="fas fa-calendar-days" style={{ marginRight: "0.35rem" }} />
            {formatEventDate(event.startsAt, event.endsAt)}
          </p>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <div className="location-block">
            <p className="contact-line">
              <i
                className="fas fa-location-dot"
                style={{ marginRight: "0.4rem", color: "var(--accent-pink)" }}
              />
              {event.location}
            </p>
            <button type="button" className="map-inline-button" onClick={() => setShowMap(true)}>
              <i className="fas fa-map-location-dot" style={{ marginRight: "0.35rem" }} />
              Ver mapa
            </button>
          </div>
        </div>
      </article>

      {showMap && (
        <div className="modal-backdrop" onClick={() => setShowMap(false)}>
          <div className="modal-box map-modal" onClick={(domEvent) => domEvent.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowMap(false)} aria-label="Cerrar">
              <i className="fas fa-xmark" />
            </button>
            <div className="map-modal-content">
              <h3>Ubicacion del evento</h3>
              <p>{mapAddress}, Paso de la Patria, Corrientes</p>
              <iframe
                title={`Mapa de ${event.title}`}
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

export default EventCard;
