import { resolveImageUrl } from "../api/client";

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
  return (
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
        <p className="contact-line">
          <i
            className="fas fa-location-dot"
            style={{ marginRight: "0.4rem", color: "var(--accent-pink)" }}
          />
          {event.location}
        </p>
      </div>
    </article>
  );
}

export default EventCard;
