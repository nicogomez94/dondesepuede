function ContactPage() {
  return (
    <section className="stack-md">
      <img
        src="https://picsum.photos/seed/contact-office/1100/240"
        alt="Contacto Camara de Comercio"
        className="contact-image"
        loading="lazy"
      />

      <div>
        <h2>📬 Contacto</h2>
        <p>
          Si queres sumar tu comercio al directorio o actualizar informacion,
          comunicate con la Camara de Comercio. Estamos para ayudarte.
        </p>
      </div>

      <div className="contact-info-card">
        <p>📧 <strong>Email:</strong> contacto@camaracomercio.local</p>
        <p>📞 <strong>Telefono:</strong> +54 9 11 4000 0000</p>
        <p>📍 <strong>Direccion:</strong> Calle Principal 123, Ciudad</p>
        <p>🕐 <strong>Horario:</strong> Lunes a Viernes, 8:00 – 18:00</p>
      </div>
    </section>
  );
}

export default ContactPage;
