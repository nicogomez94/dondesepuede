import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchEvents } from "../api/client";
import EventCard from "../components/EventCard";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [month, setMonth] = useState(searchParams.get("month") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "upcoming");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchEvents({ search, month, status });
        setEvents(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [search, month, status]);

  function onFilterSubmit(event) {
    event.preventDefault();
    const nextParams = {};
    if (search.trim()) nextParams.search = search.trim();
    if (month) nextParams.month = month;
    if (status) nextParams.status = status;
    setSearchParams(nextParams);
  }

  return (
    <section className="stack-md">
      <div className="banner-wrap">
        <img
          src="https://picsum.photos/seed/paso-eventos/1100/220"
          alt="Agenda de eventos en Paso de la Patria"
          className="section-banner"
          loading="lazy"
        />
        <div className="banner-overlay">
          <h1>Eventos y actividades</h1>
          <p>Ferias, festivales, torneos de pesca y mucho más. La agenda cultural de Paso de la Patria.</p>
        </div>
      </div>
      <div>
        <h2>
          <i className="fas fa-calendar-days" style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
          Agenda de eventos
        </h2>
        <p>Consulta ferias, festivales y actividades con filtros por texto, mes y estado.</p>
      </div>
      <form className="filters events-filters" onSubmit={onFilterSubmit}>
        <label>
          Buscar por titulo o lugar
          <input
            type="search"
            placeholder="Ej: feria, anfiteatro"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label>
          Filtrar por mes
          <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
        </label>
        <label>
          Estado
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Todos</option>
            <option value="upcoming">Proximos</option>
            <option value="past">Finalizados</option>
          </select>
        </label>
        <button type="submit" className="button-link">
          <i className="fas fa-filter" style={{ marginRight: "0.4rem" }} />
          Aplicar filtros
        </button>
      </form>

      {loading && <p>Cargando eventos...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !events.length ? (
        <p>No se encontraron eventos con los filtros seleccionados.</p>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}

export default EventsPage;
