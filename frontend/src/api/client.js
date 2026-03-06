const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/$/, "");
const FILES_BASE_URL = API_BASE_URL.replace(/\/api$/, "");

async function request(path, options = {}) {
  const { token, isFormData = false, body, ...rest } = options;

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(rest.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || "Error en la solicitud.");
  }

  return data;
}

export function resolveImageUrl(logoUrl) {
  if (!logoUrl) return "https://placehold.co/640x420?text=Sin+imagen";
  if (logoUrl.startsWith("http")) return logoUrl;
  return `${FILES_BASE_URL}${logoUrl.startsWith("/") ? logoUrl : `/${logoUrl}`}`;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function fetchCategories() {
  return request("/categories");
}

export async function fetchBusinesses({ search = "", categoryId = "" } = {}) {
  const query = new URLSearchParams();
  if (search.trim()) query.set("search", search.trim());
  if (categoryId) query.set("categoryId", categoryId);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request(`/businesses${suffix}`);
}

export async function fetchBusinessById(id) {
  return request(`/businesses/${id}`);
}

export async function loginAdmin(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export async function adminFetchCategories(token) {
  return request("/admin/categories", { token });
}

export async function adminCreateCategory(token, payload) {
  return request("/admin/categories", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function adminUpdateCategory(token, id, payload) {
  return request(`/admin/categories/${id}`, {
    method: "PUT",
    token,
    body: payload,
  });
}

export async function adminDeleteCategory(token, id) {
  return request(`/admin/categories/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function adminFetchBusinesses(token) {
  return request("/admin/businesses", { token });
}

export async function adminCreateBusiness(token, payload) {
  return request("/admin/businesses", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function adminUpdateBusiness(token, id, payload) {
  return request(`/admin/businesses/${id}`, {
    method: "PUT",
    token,
    body: payload,
  });
}

export async function adminDeleteBusiness(token, id) {
  return request(`/admin/businesses/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function adminUploadImage(token, file) {
  const formData = new FormData();
  formData.append("image", file);

  return request("/admin/upload/image", {
    method: "POST",
    token,
    body: formData,
    isFormData: true,
  });
}
