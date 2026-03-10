import { useEffect, useState } from "react";
import { fetchUsefulPhones } from "../api/client";

const FALLBACK_EMERGENCY_NUMBERS = [
  { color: "#2563eb", label: "Policía", number: "101" },
  { color: "#dc2626", label: "Bomberos", number: "100" },
  { color: "#16a34a", label: "Ambulancia", number: "107" },
  { color: "#7c3aed", label: "Defensa Civil", number: "103" },
  { color: "#0891b2", label: "Prefectura Naval", number: "106" },
  { color: "#d97706", label: "Comisaría local", number: "0000-000000" },
  { color: "#059669", label: "Hospital municipal", number: "0000-000000" },
  { color: "#ea580c", label: "Turismo Corrientes", number: "0800-555-0000" },
];

function ContactPage() {
  const [form, setForm] = useState({ nombre: "", email: "", asunto: "", mensaje: "" });
  const [sent, setSent] = useState(false);
  const [usefulPhones, setUsefulPhones] = useState(FALLBACK_EMERGENCY_NUMBERS);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: conectar con el backend
    setSent(true);
  }

  useEffect(() => {
    let ignore = false;

    async function loadUsefulPhones() {
      try {
        const data = await fetchUsefulPhones();
        if (ignore || !Array.isArray(data) || data.length === 0) return;
        setUsefulPhones(data);
      } catch {
        if (!ignore) {
          setUsefulPhones(FALLBACK_EMERGENCY_NUMBERS);
        }
      }
    }

    loadUsefulPhones();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="stack-md">

      {/* BANNER */}
      <div className="banner-wrap">
        <img
          src="https://picsum.photos/seed/contact-office/1100/240"
          alt="Contacto — Camara de Comercio Paso de la Patria"
          className="contact-image"
          loading="lazy"
        />
        <div className="banner-overlay">
          <h1>Hablemos</h1>
          <p>La Cámara de Comercio de Paso de la Patria está para ayudarte. Sumate al directorio comercial.</p>
        </div>
      </div>

      {/* FORMULARIO + INFO */}
      <div className="contact-layout">

        {/* FORMULARIO */}
        <div className="contact-form-wrap">
          <h2>
            <i className="fas fa-envelope-open-text" style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
            Envianos un mensaje
          </h2>
          <p className="contact-form-desc">
            Completá el formulario y nos ponemos en contacto a la brevedad.
          </p>

          {sent ? (
            <div className="contact-success">
              <i className="fas fa-circle-check" />
              <p>¡Mensaje enviado! Nos comunicaremos pronto.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="asunto">Asunto</label>
                <input
                  id="asunto"
                  name="asunto"
                  type="text"
                  placeholder="¿En qué podemos ayudarte?"
                  value={form.asunto}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  placeholder="Contanos más..."
                  value={form.mensaje}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="contact-submit">
                <i className="fas fa-paper-plane" style={{ marginRight: "0.5rem" }} />
                Enviar mensaje
              </button>
            </form>
          )}
        </div>

        {/* INFO */}
        <div className="contact-info-wrap">
          <h2>
            <i className="fas fa-map-pin" style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
            Información
          </h2>
          <div className="contact-info-card">
            <p>
              <i className="fas fa-envelope" style={{ marginRight: "0.6rem", color: "var(--primary)" }} />
              <strong>Email:</strong> contacto@camaracomercio.local
            </p>
            <p>
              <i className="fas fa-phone" style={{ marginRight: "0.6rem", color: "var(--secondary)" }} />
              <strong>Teléfono:</strong> +54 9 11 4000 0000
            </p>
            <p>
              <i className="fas fa-location-dot" style={{ marginRight: "0.6rem", color: "var(--accent-pink)" }} />
              <strong>Dirección:</strong> Calle Principal 123, Paso de la Patria, Corrientes
            </p>
            <p>
              <i className="fas fa-clock" style={{ marginRight: "0.6rem", color: "var(--accent-teal)" }} />
              <strong>Horario:</strong> Lunes a Viernes, 8:00 – 18:00
            </p>
          </div>
        </div>

      </div>

      {/* TELÉFONOS ÚTILES */}
      <div>
        <h2>
          <i className="fas fa-phone-volume" style={{ marginRight: "0.5rem", color: "var(--primary)" }} />
          Teléfonos útiles
        </h2>
        <p style={{ opacity: 0.6, marginBottom: "1rem" }}>
          Números de emergencia y servicios esenciales de la zona.
        </p>
        <div className="emergency-grid">
          {usefulPhones.map((item) => (
            <a
              key={item.id || item.label}
              href={`tel:${item.number.replace(/\D/g, "")}`}
              className="emergency-card"
              style={{ borderLeft: `6px solid ${item.color || "var(--primary)"}` }}
            >
              <div className="emergency-info">
                <span className="emergency-label" style={{ color: item.color || "#5a3020" }}>{item.label}</span>
                <span className="emergency-number">{item.number}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

    </section>
  );
}

export default ContactPage;
