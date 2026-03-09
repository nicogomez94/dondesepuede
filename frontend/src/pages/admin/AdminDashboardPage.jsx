import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminCreateBusiness,
  adminCreateCategory,
  adminCreateEvent,
  adminDeleteBusiness,
  adminDeleteCategory,
  adminDeleteEvent,
  adminFetchBusinesses,
  adminFetchCategories,
  adminFetchEvents,
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
  const [categoryName, setCategoryName] = useState(() => getDebugCategoryValue());
  const [editingCategory, setEditingCategory] = useState(null);
  const [businessForm, setBusinessForm] = useState(() => getDebugBusinessValues());
  const [eventForm, setEventForm] = useState(() => getDebugEventValues());
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const categoriesById = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const loadAdminData = useCallback(async () => {
    try {
      setError("");
      const [categoriesData, businessesData, eventsData] = await Promise.all([
        adminFetchCategories(token),
        adminFetchBusinesses(token),
        adminFetchEvents(token),
      ]);
      setCategories(categoriesData);
      setBusinesses(businessesData);
      setEvents(eventsData);
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
    if (editingCategory || categoryName) return;
    setCategoryName(getDebugCategoryValue());
  }, [editingCategory, categoryName]);

  useEffect(() => {
    if (businessForm.id || businessForm.categoryId || categories.length === 0) return;
    setBusinessForm((prev) => getDebugBusinessValues(String(categories[0].id || prev.categoryId)));
  }, [businessForm.categoryId, businessForm.id, categories]);

  async function submitCategory(event) {
    event.preventDefault();
    const isEditing = Boolean(editingCategory);
    if (!confirmAction(isEditing ? "actualizar" : "crear", "categoria")) return;
    setFeedback("");
    setError("");

    try {
      if (isEditing) {
        await adminUpdateCategory(token, editingCategory, { name: categoryName });
        setFeedback("Categoria actualizada.");
      } else {
        await adminCreateCategory(token, { name: categoryName });
        setFeedback("Categoria creada.");
      }

      setCategoryName(getDebugCategoryValue());
      setEditingCategory(null);
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
      const payload = {
        ...businessForm,
        categoryId: Number(businessForm.categoryId),
      };

      if (isEditing) {
        await adminUpdateBusiness(token, businessForm.id, payload);
        setFeedback("Comercio actualizado.");
      } else {
        await adminCreateBusiness(token, payload);
        setFeedback("Comercio creado.");
      }

      setBusinessForm(getDebugBusinessValues(String(categories[0]?.id || "")));
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

  function startEditBusiness(business) {
    if (!confirmAction("editar", "comercio")) return;
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
    setTab("businesses");
  }

  function startEditEvent(event) {
    if (!confirmAction("editar", "evento")) return;
    setEventForm({
      id: event.id,
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      startsAt: toDateTimeLocalValue(event.startsAt),
      endsAt: toDateTimeLocalValue(event.endsAt),
      imageUrl: event.imageUrl || "",
    });
    setTab("events");
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
            onClick={() => setTab("events")}
          >
            Eventos
          </button>
          <button
            type="button"
            className={tab === "businesses" ? "button-link" : "ghost-button"}
            onClick={() => setTab("businesses")}
          >
            Comercios
          </button>
          <button
            type="button"
            className={tab === "categories" ? "button-link" : "ghost-button"}
            onClick={() => setTab("categories")}
          >
            Categorias
          </button>
          <button type="button" className="ghost-button" onClick={logout}>
            Cerrar sesion
          </button>
        </div>
      </header>

      {feedback && <p className="ok-message">{feedback}</p>}
      {error && <p className="error-message">{error}</p>}

      {tab === "events" && (
        <section className="admin-grid">
          <form className="form-card" onSubmit={submitEvent}>
            <h2>{eventForm.id ? "Editar evento" : "Nuevo evento"}</h2>
            <label>
              Titulo
              <input
                value={eventForm.title}
                onChange={(event) =>
                  setEventForm((prev) => ({ ...prev, title: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Descripcion
              <textarea
                rows={3}
                value={eventForm.description}
                onChange={(event) =>
                  setEventForm((prev) => ({ ...prev, description: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Lugar
              <input
                value={eventForm.location}
                onChange={(event) =>
                  setEventForm((prev) => ({ ...prev, location: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Inicio
              <input
                type="datetime-local"
                value={eventForm.startsAt}
                onChange={(event) =>
                  setEventForm((prev) => ({ ...prev, startsAt: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Fin
              <input
                type="datetime-local"
                value={eventForm.endsAt}
                onChange={(event) =>
                  setEventForm((prev) => ({ ...prev, endsAt: event.target.value }))
                }
              />
            </label>
            <label>
              Imagen (URL)
              <input
                value={eventForm.imageUrl}
                onChange={(event) =>
                  setEventForm((prev) => ({ ...prev, imageUrl: event.target.value }))
                }
              />
            </label>
            <label>
              Subir imagen
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  await uploadImageTo(setEventForm, file);
                  event.target.value = "";
                }}
              />
            </label>
            {eventForm.imageUrl && (
              <img
                src={resolveImageUrl(eventForm.imageUrl)}
                alt="Preview del evento"
                className="preview-image"
              />
            )}
            <button type="submit" className="button-link">
              {eventForm.id ? "Guardar cambios" : "Crear evento"}
            </button>
          </form>

          <div className="list-card">
            <h2>Eventos</h2>
            <ul className="admin-list">
              {events.map((event) => (
                <li key={event.id}>
                  <span>
                    {event.title} - {new Date(event.startsAt).toLocaleString("es-AR")}
                  </span>
                  <div>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => startEditEvent(event)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => removeEvent(event.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {tab === "categories" && (
        <section className="admin-grid">
          <form className="form-card" onSubmit={submitCategory}>
            <h2>{editingCategory ? "Editar categoria" : "Nueva categoria"}</h2>
            <label>
              Nombre
              <input
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                required
              />
            </label>
            <button type="submit" className="button-link">
              {editingCategory ? "Actualizar" : "Crear"}
            </button>
          </form>

          <div className="list-card">
            <h2>Categorias</h2>
            <ul className="admin-list">
              {categories.map((category) => (
                <li key={category.id}>
                  <span>
                    {category.name} ({category._count?.businesses || 0})
                  </span>
                  <div>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => {
                        if (!confirmAction("editar", "categoria")) return;
                        setEditingCategory(category.id);
                        setCategoryName(category.name);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => removeCategory(category.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {tab === "businesses" && (
        <section className="admin-grid">
          <form className="form-card" onSubmit={submitBusiness}>
            <h2>{businessForm.id ? "Editar comercio" : "Nuevo comercio"}</h2>
            <label>
              Nombre
              <input
                value={businessForm.name}
                onChange={(event) =>
                  setBusinessForm((prev) => ({ ...prev, name: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Descripcion
              <textarea
                rows={3}
                value={businessForm.description}
                onChange={(event) =>
                  setBusinessForm((prev) => ({ ...prev, description: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Categoria
              <select
                value={businessForm.categoryId}
                onChange={(event) =>
                  setBusinessForm((prev) => ({ ...prev, categoryId: event.target.value }))
                }
                required
              >
                <option value="">Seleccionar</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Telefono
              <input
                value={businessForm.phone}
                onChange={(event) =>
                  setBusinessForm((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
            </label>
            <label>
              Direccion
              <input
                value={businessForm.address}
                onChange={(event) =>
                  setBusinessForm((prev) => ({ ...prev, address: event.target.value }))
                }
              />
            </label>
            <label>
              Instagram
              <input
                value={businessForm.instagram}
                onChange={(event) =>
                  setBusinessForm((prev) => ({ ...prev, instagram: event.target.value }))
                }
              />
            </label>
            <label>
              Facebook
              <input
                value={businessForm.facebook}
                onChange={(event) =>
                  setBusinessForm((prev) => ({ ...prev, facebook: event.target.value }))
                }
              />
            </label>
            <label>
              Website
              <input
                value={businessForm.website}
                onChange={(event) =>
                  setBusinessForm((prev) => ({ ...prev, website: event.target.value }))
                }
              />
            </label>
            <label>
              Logo/imagen (URL)
              <input
                value={businessForm.logoUrl}
                onChange={(event) =>
                  setBusinessForm((prev) => ({ ...prev, logoUrl: event.target.value }))
                }
              />
            </label>
            <label>
              Subir imagen
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  await uploadImageTo(setBusinessForm, file);
                  event.target.value = "";
                }}
              />
            </label>
            {businessForm.logoUrl && (
              <img
                src={resolveImageUrl(businessForm.logoUrl)}
                alt="Preview"
                className="preview-image"
              />
            )}
            <button type="submit" className="button-link">
              {businessForm.id ? "Guardar cambios" : "Crear comercio"}
            </button>
          </form>

          <div className="list-card">
            <h2>Comercios</h2>
            <ul className="admin-list">
              {businesses.map((business) => (
                <li key={business.id}>
                  <span>
                    {business.name} - {categoriesById[business.categoryId] || "Sin categoria"}
                  </span>
                  <div>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => startEditBusiness(business)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => removeBusiness(business.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </section>
  );
}

export default AdminDashboardPage;
