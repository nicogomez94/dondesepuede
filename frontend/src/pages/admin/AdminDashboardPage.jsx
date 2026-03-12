import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminCreateUsefulPhone,
  adminCreateBusiness,
  adminCreateCategory,
  adminCreateEvent,
  adminDeleteUsefulPhone,
  adminDeleteBusiness,
  adminDeleteCategory,
  adminDeleteEvent,
  adminFetchUsefulPhones,
  adminFetchBusinesses,
  adminFetchCategories,
  adminFetchEvents,
  adminUpdateUsefulPhone,
  adminUpdateBusiness,
  adminUpdateCategory,
  adminUpdateEvent,
  adminUploadImage,
  resolveImageUrl,
} from "../../api/client";
import {
  getDebugBusinessValues,
  getDebugCategoryValue,
  getDebugEventValues,
} from "../../utils/debugPrefill";

function toDateTimeLocalValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

function confirmAction(action, entity) {
  return window.confirm(`Confirmar ${action} ${entity}?`);
}

function AdminDashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [tab, setTab] = useState("businesses");
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [events, setEvents] = useState([]);
  const [usefulPhones, setUsefulPhones] = useState([]);
  const [categoryName, setCategoryName] = useState(() => getDebugCategoryValue());
  const [categoryImageUrl, setCategoryImageUrl] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [usefulPhoneForm, setUsefulPhoneForm] = useState({
    id: null,
    label: "",
    number: "",
    color: "#ff6b35",
    sortOrder: 0,
  });
  const [businessForm, setBusinessForm] = useState(() => getDebugBusinessValues());
  const [eventForm, setEventForm] = useState(() => getDebugEventValues());
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const categoriesById = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const loadAdminData = useCallback(async () => {
    try {
      setError("");
      const [categoriesData, businessesData, eventsData, usefulPhonesData] = await Promise.all([
        adminFetchCategories(token),
        adminFetchBusinesses(token),
        adminFetchEvents(token),
        adminFetchUsefulPhones(token),
      ]);
      setCategories(categoriesData);
      setBusinesses(businessesData);
      setEvents(eventsData);
      setUsefulPhones(usefulPhonesData);
    } catch (e) {
      if (e.message.toLowerCase().includes("token")) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }
      setError(e.message);
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    loadAdminData();
  }, [loadAdminData, navigate, token]);

  useEffect(() => {
    if (editingCategory || categoryName || categoryImageUrl) return;
    setCategoryName(getDebugCategoryValue());
  }, [editingCategory, categoryImageUrl, categoryName]);

  useEffect(() => {
    if (businessForm.id || businessForm.categoryId || categories.length === 0) return;
    setBusinessForm((prev) => getDebugBusinessValues(String(categories[0].id || prev.categoryId)));
  }, [businessForm.categoryId, businessForm.id, categories]);

  function closeModal() {
    setFormOpen(false);
  }

  async function submitCategory(event) {
    event.preventDefault();
    const isEditing = Boolean(editingCategory);
    if (!confirmAction(isEditing ? "actualizar" : "crear", "categoria")) return;
    setFeedback("");
    setError("");
    try {
      const payload = {
        name: categoryName,
        imageUrl: categoryImageUrl,
      };
      if (isEditing) {
        await adminUpdateCategory(token, editingCategory, payload);
        setFeedback("Categoria actualizada.");
      } else {
        await adminCreateCategory(token, payload);
        setFeedback("Categoria creada.");
      }
      setCategoryName(getDebugCategoryValue());
      setCategoryImageUrl("");
      setEditingCategory(null);
      closeModal();
      await loadAdminData();
    } catch (e) {
      setError(e.message);
    }
  }

  async function removeCategory(id) {
    if (!confirmAction("eliminar", "categoria")) return;
    setFeedback("");
    setError("");
    try {
      await adminDeleteCategory(token, id);
      setFeedback("Categoria eliminada.");
      await loadAdminData();
    } catch (e) {
      setError(e.message);
    }
  }

  async function submitBusiness(event) {
    event.preventDefault();
    const isEditing = Boolean(businessForm.id);
    if (!confirmAction(isEditing ? "actualizar" : "crear", "comercio")) return;
    setFeedback("");
    setError("");
    try {
      const payload = { ...businessForm, categoryId: Number(businessForm.categoryId) };
      if (isEditing) {
        await adminUpdateBusiness(token, businessForm.id, payload);
        setFeedback("Comercio actualizado.");
      } else {
        await adminCreateBusiness(token, payload);
        setFeedback("Comercio creado.");
      }
      setBusinessForm(getDebugBusinessValues(String(categories[0]?.id || "")));
      closeModal();
      await loadAdminData();
    } catch (e) {
      setError(e.message);
    }
  }

  async function removeBusiness(id) {
    if (!confirmAction("eliminar", "comercio")) return;
    setFeedback("");
    setError("");
    try {
      await adminDeleteBusiness(token, id);
      setFeedback("Comercio eliminado.");
      await loadAdminData();
    } catch (e) {
      setError(e.message);
    }
  }

  async function submitEvent(event) {
    event.preventDefault();
    const isEditing = Boolean(eventForm.id);
    if (!confirmAction(isEditing ? "actualizar" : "crear", "evento")) return;
    setFeedback("");
    setError("");
    try {
      const payload = {
        ...eventForm,
        startsAt: eventForm.startsAt || null,
        endsAt: eventForm.endsAt || null,
      };
      if (isEditing) {
        await adminUpdateEvent(token, eventForm.id, payload);
        setFeedback("Evento actualizado.");
      } else {
        await adminCreateEvent(token, payload);
        setFeedback("Evento creado.");
      }
      setEventForm(getDebugEventValues());
      closeModal();
      await loadAdminData();
    } catch (e) {
      setError(e.message);
    }
  }

  async function removeEvent(id) {
    if (!confirmAction("eliminar", "evento")) return;
    setFeedback("");
    setError("");
    try {
      await adminDeleteEvent(token, id);
      setFeedback("Evento eliminado.");
      await loadAdminData();
    } catch (e) {
      setError(e.message);
    }
  }

  async function uploadImageTo(setter, file) {
    setUploading(true);
    setError("");
    setFeedback("");
    try {
      const response = await adminUploadImage(token, file);
      setter((prev) => ({ ...prev, imageUrl: response.url }));
      setFeedback("Imagen subida correctamente.");
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function uploadCategoryImage(file) {
    setUploading(true);
    setError("");
    setFeedback("");
    try {
      const response = await adminUploadImage(token, file);
      setCategoryImageUrl(response.url);
      setFeedback("Imagen subida correctamente.");
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  function startEditBusiness(business) {
    setBusinessForm({
      id: business.id,
      name: business.name || "",
      description: business.description || "",
      phone: business.phone || "",
      address: business.address || "",
      logoUrl: business.logoUrl || "",
      categoryId: business.categoryId || "",
      instagram: business.instagram || "",
      facebook: business.facebook || "",
      website: business.website || "",
    });
    setFormOpen(true);
  }

  function startNewBusiness() {
    setBusinessForm(getDebugBusinessValues(String(categories[0]?.id || "")));
    setFormOpen(true);
  }

  function startEditEvent(event) {
    setEventForm({
      id: event.id,
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      startsAt: toDateTimeLocalValue(event.startsAt),
      endsAt: toDateTimeLocalValue(event.endsAt),
      imageUrl: event.imageUrl || "",
    });
    setFormOpen(true);
  }

  function startNewEvent() {
    setEventForm(getDebugEventValues());
    setFormOpen(true);
  }

  function startEditCategory(category) {
    setEditingCategory(category.id);
    setCategoryName(category.name);
    setCategoryImageUrl(category.imageUrl || category.image_url || "");
    setFormOpen(true);
  }

  function startNewCategory() {
    setEditingCategory(null);
    setCategoryName(getDebugCategoryValue());
    setCategoryImageUrl("");
    setFormOpen(true);
  }

  function startEditUsefulPhone(usefulPhone) {
    setUsefulPhoneForm({
      id: usefulPhone.id,
      label: usefulPhone.label || "",
      number: usefulPhone.number || "",
      color: usefulPhone.color || "#ff6b35",
      sortOrder: usefulPhone.sortOrder || 0,
    });
    setFormOpen(true);
  }

  function startNewUsefulPhone() {
    const maxSortOrder = usefulPhones.reduce((max, item) => Math.max(max, item.sortOrder || 0), 0);
    setUsefulPhoneForm({
      id: null,
      label: "",
      number: "",
      color: "#ff6b35",
      sortOrder: maxSortOrder + 1,
    });
    setFormOpen(true);
  }

  async function submitUsefulPhone(event) {
    event.preventDefault();
    const isEditing = Boolean(usefulPhoneForm.id);
    if (!confirmAction(isEditing ? "actualizar" : "crear", "telefono util")) return;
    setFeedback("");
    setError("");
    try {
      const payload = {
        label: usefulPhoneForm.label,
        number: usefulPhoneForm.number,
        color: usefulPhoneForm.color,
        sortOrder: Number(usefulPhoneForm.sortOrder || 0),
      };
      if (isEditing) {
        await adminUpdateUsefulPhone(token, usefulPhoneForm.id, payload);
        setFeedback("Telefono util actualizado.");
      } else {
        await adminCreateUsefulPhone(token, payload);
        setFeedback("Telefono util creado.");
      }
      closeModal();
      await loadAdminData();
    } catch (e) {
      setError(e.message);
    }
  }

  async function removeUsefulPhone(id) {
    if (!confirmAction("eliminar", "telefono util")) return;
    setFeedback("");
    setError("");
    try {
      await adminDeleteUsefulPhone(token, id);
      setFeedback("Telefono util eliminado.");
      await loadAdminData();
    } catch (e) {
      setError(e.message);
    }
  }

  function logout() {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  return (
    <section className="admin-page">
      <header className="admin-header">
        <h1>Panel de administracion</h1>
        <div className="admin-actions">
          <button
            type="button"
            className={tab === "events" ? "button-link" : "ghost-button"}
            onClick={() => { setTab("events"); setFormOpen(false); }}
          >
            Eventos
          </button>
          <button
            type="button"
            className={tab === "businesses" ? "button-link" : "ghost-button"}
            onClick={() => { setTab("businesses"); setFormOpen(false); }}
          >
            Comercios
          </button>
          <button
            type="button"
            className={tab === "categories" ? "button-link" : "ghost-button"}
            onClick={() => { setTab("categories"); setFormOpen(false); }}
          >
            Categorias
          </button>
          <button
            type="button"
            className={tab === "usefulPhones" ? "button-link" : "ghost-button"}
            onClick={() => { setTab("usefulPhones"); setFormOpen(false); }}
          >
            Telefonos utiles
          </button>
          <button type="button" className="ghost-button" onClick={logout}>
            Cerrar sesion
          </button>
        </div>
      </header>

      {!formOpen && feedback && <p className="ok-message">{feedback}</p>}
      {!formOpen && error && <p className="error-message">{error}</p>}

      {/* ── COMERCIOS ── */}
      {tab === "businesses" && (
        <div className="list-card" style={{ marginTop: "1rem" }}>
          <div className="list-card-header">
            <h2>Comercios</h2>
            <button type="button" className="button-link" onClick={startNewBusiness}>
              <i className="fas fa-plus" style={{ marginRight: "0.4rem" }} />
              Nuevo comercio
            </button>
          </div>
          <ul className="admin-list">
            {businesses.map((business) => (
              <li key={business.id}>
                <span>{business.name} — {categoriesById[business.categoryId] || "Sin categoria"}</span>
                <div>
                  <button type="button" className="ghost-button" onClick={() => startEditBusiness(business)}>
                    Editar
                  </button>
                  <button type="button" className="danger-button" onClick={() => removeBusiness(business.id)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── EVENTOS ── */}
      {tab === "events" && (
        <div className="list-card" style={{ marginTop: "1rem" }}>
          <div className="list-card-header">
            <h2>Eventos</h2>
            <button type="button" className="button-link" onClick={startNewEvent}>
              <i className="fas fa-plus" style={{ marginRight: "0.4rem" }} />
              Nuevo evento
            </button>
          </div>
          <ul className="admin-list">
            {events.map((event) => (
              <li key={event.id}>
                <span>{event.title} — {new Date(event.startsAt).toLocaleString("es-AR")}</span>
                <div>
                  <button type="button" className="ghost-button" onClick={() => startEditEvent(event)}>
                    Editar
                  </button>
                  <button type="button" className="danger-button" onClick={() => removeEvent(event.id)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── CATEGORIAS ── */}
      {tab === "categories" && (
        <div className="list-card" style={{ marginTop: "1rem" }}>
          <div className="list-card-header">
            <h2>Categorias</h2>
            <button type="button" className="button-link" onClick={startNewCategory}>
              <i className="fas fa-plus" style={{ marginRight: "0.4rem" }} />
              Nueva categoria
            </button>
          </div>
          <ul className="admin-list">
            {categories.map((category) => (
              <li key={category.id}>
                <span>{category.name} ({category._count?.businesses || 0})</span>
                <div>
                  <button type="button" className="ghost-button" onClick={() => startEditCategory(category)}>
                    Editar
                  </button>
                  <button type="button" className="danger-button" onClick={() => removeCategory(category.id)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── TELEFONOS UTILES ── */}
      {tab === "usefulPhones" && (
        <div className="list-card" style={{ marginTop: "1rem" }}>
          <div className="list-card-header">
            <h2>Telefonos utiles</h2>
            <button type="button" className="button-link" onClick={startNewUsefulPhone}>
              <i className="fas fa-plus" style={{ marginRight: "0.4rem" }} />
              Nuevo telefono
            </button>
          </div>
          <ul className="admin-list">
            {usefulPhones.map((usefulPhone) => (
              <li key={usefulPhone.id}>
                <span>
                  {usefulPhone.label} - {usefulPhone.number}
                  <small className="admin-list-meta"> Orden: {usefulPhone.sortOrder || 0}</small>
                </span>
                <div>
                  <button type="button" className="ghost-button" onClick={() => startEditUsefulPhone(usefulPhone)}>
                    Editar
                  </button>
                  <button type="button" className="danger-button" onClick={() => removeUsefulPhone(usefulPhone.id)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── MODAL ── */}
      {formOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={closeModal} aria-label="Cerrar">
              <i className="fas fa-xmark" />
            </button>
            {feedback && <p className="ok-message">{feedback}</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Formulario comercio */}
            {tab === "businesses" && (
              <form className="form-card modal-form" onSubmit={submitBusiness}>
                <h2>{businessForm.id ? "Editar comercio" : "Nuevo comercio"}</h2>
                <label>
                  Nombre
                  <input
                    value={businessForm.name}
                    onChange={(e) => setBusinessForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Descripcion
                  <textarea
                    rows={3}
                    value={businessForm.description}
                    onChange={(e) => setBusinessForm((prev) => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Categoria
                  <select
                    value={businessForm.categoryId}
                    onChange={(e) => setBusinessForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Telefono
                  <input
                    value={businessForm.phone}
                    onChange={(e) => setBusinessForm((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </label>
                <label>
                  Direccion
                  <input
                    value={businessForm.address}
                    onChange={(e) => setBusinessForm((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </label>
                <label>
                  Instagram
                  <input
                    value={businessForm.instagram}
                    onChange={(e) => setBusinessForm((prev) => ({ ...prev, instagram: e.target.value }))}
                  />
                </label>
                <label>
                  Facebook
                  <input
                    value={businessForm.facebook}
                    onChange={(e) => setBusinessForm((prev) => ({ ...prev, facebook: e.target.value }))}
                  />
                </label>
                <label>
                  Website
                  <input
                    value={businessForm.website}
                    onChange={(e) => setBusinessForm((prev) => ({ ...prev, website: e.target.value }))}
                  />
                </label>
                <label>
                  Logo/imagen (URL)
                  <input
                    value={businessForm.logoUrl}
                    onChange={(e) => setBusinessForm((prev) => ({ ...prev, logoUrl: e.target.value }))}
                  />
                </label>
                <label>
                  Subir imagen
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      await uploadImageTo(setBusinessForm, file);
                      e.target.value = "";
                    }}
                  />
                </label>
                {businessForm.logoUrl && (
                  <img src={resolveImageUrl(businessForm.logoUrl)} alt="Preview" className="preview-image" />
                )}
                <div className="modal-form-actions">
                  <button type="button" className="ghost-button" onClick={closeModal}>Cancelar</button>
                  <button type="submit" className="button-link">
                    {businessForm.id ? "Guardar cambios" : "Crear comercio"}
                  </button>
                </div>
              </form>
            )}

            {/* Formulario evento */}
            {tab === "events" && (
              <form className="form-card modal-form" onSubmit={submitEvent}>
                <h2>{eventForm.id ? "Editar evento" : "Nuevo evento"}</h2>
                <label>
                  Titulo
                  <input
                    value={eventForm.title}
                    onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Descripcion
                  <textarea
                    rows={3}
                    value={eventForm.description}
                    onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Lugar
                  <input
                    value={eventForm.location}
                    onChange={(e) => setEventForm((prev) => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Inicio
                  <input
                    type="datetime-local"
                    value={eventForm.startsAt}
                    onChange={(e) => setEventForm((prev) => ({ ...prev, startsAt: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Fin
                  <input
                    type="datetime-local"
                    value={eventForm.endsAt}
                    onChange={(e) => setEventForm((prev) => ({ ...prev, endsAt: e.target.value }))}
                  />
                </label>
                <label>
                  Imagen (URL)
                  <input
                    value={eventForm.imageUrl}
                    onChange={(e) => setEventForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  />
                </label>
                <label>
                  Subir imagen
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      await uploadImageTo(setEventForm, file);
                      e.target.value = "";
                    }}
                  />
                </label>
                {eventForm.imageUrl && (
                  <img src={resolveImageUrl(eventForm.imageUrl)} alt="Preview del evento" className="preview-image" />
                )}
                <div className="modal-form-actions">
                  <button type="button" className="ghost-button" onClick={closeModal}>Cancelar</button>
                  <button type="submit" className="button-link">
                    {eventForm.id ? "Guardar cambios" : "Crear evento"}
                  </button>
                </div>
              </form>
            )}

            {/* Formulario categoria */}
            {tab === "categories" && (
              <form className="form-card modal-form" onSubmit={submitCategory}>
                <h2>{editingCategory ? "Editar categoria" : "Nueva categoria"}</h2>
                <label>
                  Nombre
                  <input
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Imagen (URL)
                  <input
                    value={categoryImageUrl}
                    onChange={(e) => setCategoryImageUrl(e.target.value)}
                  />
                </label>
                <label>
                  Subir imagen
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      await uploadCategoryImage(file);
                      e.target.value = "";
                    }}
                  />
                </label>
                {categoryImageUrl && (
                  <img src={resolveImageUrl(categoryImageUrl)} alt="Preview de categoria" className="preview-image" />
                )}
                <div className="modal-form-actions">
                  <button type="button" className="ghost-button" onClick={closeModal}>Cancelar</button>
                  <button type="submit" className="button-link">
                    {editingCategory ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            )}

            {/* Formulario telefono util */}
            {tab === "usefulPhones" && (
              <form className="form-card modal-form" onSubmit={submitUsefulPhone}>
                <h2>{usefulPhoneForm.id ? "Editar telefono util" : "Nuevo telefono util"}</h2>
                <label>
                  Etiqueta
                  <input
                    value={usefulPhoneForm.label}
                    onChange={(e) => setUsefulPhoneForm((prev) => ({ ...prev, label: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Numero
                  <input
                    value={usefulPhoneForm.number}
                    onChange={(e) => setUsefulPhoneForm((prev) => ({ ...prev, number: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Color
                  <input
                    type="color"
                    value={usefulPhoneForm.color}
                    onChange={(e) => setUsefulPhoneForm((prev) => ({ ...prev, color: e.target.value }))}
                  />
                </label>
                <label>
                  Orden
                  <input
                    type="number"
                    value={usefulPhoneForm.sortOrder}
                    onChange={(e) => setUsefulPhoneForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
                  />
                </label>
                <div className="modal-form-actions">
                  <button type="button" className="ghost-button" onClick={closeModal}>Cancelar</button>
                  <button type="submit" className="button-link">
                    {usefulPhoneForm.id ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminDashboardPage;
