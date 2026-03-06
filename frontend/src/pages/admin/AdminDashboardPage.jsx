import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminCreateBusiness,
  adminCreateCategory,
  adminDeleteBusiness,
  adminDeleteCategory,
  adminFetchBusinesses,
  adminFetchCategories,
  adminUpdateBusiness,
  adminUpdateCategory,
  adminUploadImage,
  resolveImageUrl,
} from "../../api/client";

const emptyBusiness = {
  id: null,
  name: "",
  description: "",
  phone: "",
  address: "",
  logoUrl: "",
  categoryId: "",
  instagram: "",
  facebook: "",
  website: "",
};

function AdminDashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [tab, setTab] = useState("businesses");
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [businessForm, setBusinessForm] = useState(emptyBusiness);
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
      const [categoriesData, businessesData] = await Promise.all([
        adminFetchCategories(token),
        adminFetchBusinesses(token),
      ]);
      setCategories(categoriesData);
      setBusinesses(businessesData);
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

  async function submitCategory(event) {
    event.preventDefault();
    setFeedback("");
    setError("");

    try {
      if (editingCategory) {
        await adminUpdateCategory(token, editingCategory, { name: categoryName });
        setFeedback("Categoria actualizada.");
      } else {
        await adminCreateCategory(token, { name: categoryName });
        setFeedback("Categoria creada.");
      }

      setCategoryName("");
      setEditingCategory(null);
      await loadAdminData();
    } catch (e) {
      setError(e.message);
    }
  }

  async function removeCategory(id) {
    if (!window.confirm("Eliminar categoria?")) return;
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
    setFeedback("");
    setError("");

    try {
      const payload = {
        ...businessForm,
        categoryId: Number(businessForm.categoryId),
      };

      if (businessForm.id) {
        await adminUpdateBusiness(token, businessForm.id, payload);
        setFeedback("Comercio actualizado.");
      } else {
        await adminCreateBusiness(token, payload);
        setFeedback("Comercio creado.");
      }

      setBusinessForm(emptyBusiness);
      await loadAdminData();
    } catch (e) {
      setError(e.message);
    }
  }

  async function removeBusiness(id) {
    if (!window.confirm("Eliminar comercio?")) return;
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

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setFeedback("");

    try {
      const response = await adminUploadImage(token, file);
      setBusinessForm((prev) => ({ ...prev, logoUrl: response.url }));
      setFeedback("Imagen subida correctamente.");
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      event.target.value = "";
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
    setTab("businesses");
  }

  function logout() {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <h1>Panel de administracion</h1>
        <div className="admin-actions">
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
              <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} />
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
    </main>
  );
}

export default AdminDashboardPage;
