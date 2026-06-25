import { PRELOADED_DATA } from "../data/preloadedData";

const rawApiUrl = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/$/, "");
const STORAGE_KEY = "genericDirectoryData:v3";

function normalizeApiBaseUrl(url) {
  if (/\/api$/i.test(url)) return url;
  return `${url}/api`;
}

const API_BASE_URL = normalizeApiBaseUrl(rawApiUrl);
const FILES_BASE_URL = API_BASE_URL.replace(/\/api$/, "");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function isBrowser() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function withCategoryCounts(data) {
  const businesses = data.businesses.map((business) => {
    const category = data.categories.find((item) => Number(item.id) === Number(business.categoryId)) || null;
    return { ...business, category };
  });

  const activeBusinesses = businesses.filter(isOfferActive);
  const categories = data.categories.map((category) => ({
    ...category,
    _count: {
      businesses: activeBusinesses.filter((business) => Number(business.categoryId) === Number(category.id)).length,
    },
  }));

  return { ...data, categories, businesses };
}

function getStoredData() {
  if (!isBrowser()) return withCategoryCounts(clone(PRELOADED_DATA));

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initialData = withCategoryCounts(clone(PRELOADED_DATA));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }

  try {
    return withCategoryCounts(JSON.parse(stored));
  } catch {
    const initialData = withCategoryCounts(clone(PRELOADED_DATA));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
}

function saveData(nextData) {
  const normalizedData = withCategoryCounts(nextData);
  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedData));
  }
  return normalizedData;
}

function nextId(items) {
  return items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

function sortByName(items) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function toOfferExpiration(value) {
  if (!value) return "";
  const normalized = String(value);
  return new Date(normalized.includes("T") ? normalized : `${normalized}T23:59:59`).toISOString();
}

function isOfferActive(offer) {
  if (!offer.expiresAt) return true;
  const expiresAt = new Date(offer.expiresAt);
  return Number.isNaN(expiresAt.getTime()) || expiresAt >= new Date();
}

function sortEvents(items) {
  return [...items].sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt) || Number(b.id) - Number(a.id));
}

function sortUsefulPhones(items) {
  return [...items].sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
}

function reject(message) {
  return Promise.reject(new Error(message));
}

export function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "https://placehold.co/640x420?text=Sin+imagen";
  if (/^(https?:|data:|blob:)/i.test(imageUrl)) return imageUrl;
  return `${FILES_BASE_URL}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function fetchCategories() {
  return sortByName(getStoredData().categories);
}

export async function fetchBusinesses({ search = "", categoryId = "" } = {}) {
  const data = getStoredData();
  const searchTerm = normalizeText(search);
  const selectedCategory = Number(categoryId);

  return data.businesses.filter((business) => {
    if (!isOfferActive(business)) return false;
    const matchesSearch = !searchTerm || [business.name, business.description, business.address]
      .some((value) => normalizeText(value).includes(searchTerm));
    const matchesCategory = !selectedCategory || Number(business.categoryId) === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(a.expiresAt || "2999-12-31") - new Date(b.expiresAt || "2999-12-31"));
}

export async function fetchBusinessById(id) {
  const business = getStoredData().businesses.find((item) => Number(item.id) === Number(id));
  if (!business || !isOfferActive(business)) throw new Error("Oferta no encontrada o vencida.");
  return business;
}

export async function fetchEvents({ search = "", month = "", status = "" } = {}) {
  const searchTerm = normalizeText(search);
  const now = new Date();

  return sortEvents(getStoredData().events).filter((event) => {
    const startsAt = new Date(event.startsAt);
    const matchesSearch = !searchTerm || [event.title, event.description, event.location]
      .some((value) => normalizeText(value).includes(searchTerm));
    const matchesMonth = !month || event.startsAt?.slice(0, 7) === month;
    const matchesStatus =
      !status ||
      (status === "upcoming" && startsAt >= now) ||
      (status === "past" && startsAt < now);
    return matchesSearch && matchesMonth && matchesStatus;
  });
}

export async function fetchUsefulPhones() {
  return sortUsefulPhones(getStoredData().usefulPhones);
}

export async function adminFetchCategories() {
  return fetchCategories();
}

export async function adminCreateCategory(_token, payload) {
  const data = getStoredData();
  if (!payload.name?.trim()) return reject("El nombre es obligatorio.");

  const nextData = saveData({
    ...data,
    categories: [
      ...data.categories,
      {
        id: nextId(data.categories),
        name: payload.name.trim(),
        imageUrl: payload.imageUrl?.trim() || "",
      },
    ],
  });

  return nextData.categories.find((category) => category.name === payload.name.trim());
}

export async function adminUpdateCategory(_token, id, payload) {
  const data = getStoredData();
  const categoryId = Number(id);
  if (!categoryId || !payload.name?.trim()) return reject("Datos invalidos.");

  const nextData = saveData({
    ...data,
    categories: data.categories.map((category) =>
      Number(category.id) === categoryId
        ? { ...category, name: payload.name.trim(), imageUrl: payload.imageUrl?.trim() || "" }
        : category,
    ),
  });

  return nextData.categories.find((category) => Number(category.id) === categoryId);
}

export async function adminDeleteCategory(_token, id) {
  const data = getStoredData();
  const categoryId = Number(id);
  if (data.businesses.some((business) => Number(business.categoryId) === categoryId)) {
    return reject("No se puede eliminar una categoria con ofertas asociadas.");
  }

  saveData({
    ...data,
    categories: data.categories.filter((category) => Number(category.id) !== categoryId),
  });
  return null;
}

export async function adminFetchBusinesses() {
  return getStoredData().businesses;
}

export async function adminCreateBusiness(_token, payload) {
  const data = getStoredData();
  if (!payload.name?.trim() || !Number(payload.categoryId)) {
    return reject("Nombre del negocio y rubro son obligatorios.");
  }

  if (!payload.regularPrice || !payload.salePrice || !payload.expiresAt) {
    return reject("Precio anterior, precio de oferta y vencimiento son obligatorios.");
  }

  const nextBusiness = {
    id: nextId(data.businesses),
    name: payload.name.trim(),
    description: payload.description?.trim() || "",
    phone: payload.phone?.trim() || "",
    address: payload.address?.trim() || "",
    logoUrl: payload.logoUrl?.trim() || "",
    regularPrice: Number(payload.regularPrice || 0),
    salePrice: Number(payload.salePrice || 0),
    expiresAt: toOfferExpiration(payload.expiresAt),
    categoryId: Number(payload.categoryId),
    instagram: payload.instagram?.trim() || "",
    facebook: payload.facebook?.trim() || "",
    website: payload.website?.trim() || "",
  };

  const nextData = saveData({ ...data, businesses: [nextBusiness, ...data.businesses] });
  return nextData.businesses.find((business) => Number(business.id) === Number(nextBusiness.id));
}

export async function adminUpdateBusiness(_token, id, payload) {
  const data = getStoredData();
  const businessId = Number(id);
  if (!businessId || !payload.name?.trim() || !Number(payload.categoryId)) {
    return reject("Datos invalidos.");
  }

  if (!payload.regularPrice || !payload.salePrice || !payload.expiresAt) {
    return reject("Precio anterior, precio de oferta y vencimiento son obligatorios.");
  }

  const nextData = saveData({
    ...data,
    businesses: data.businesses.map((business) =>
      Number(business.id) === businessId
        ? {
            ...business,
            name: payload.name.trim(),
            description: payload.description?.trim() || "",
            phone: payload.phone?.trim() || "",
            address: payload.address?.trim() || "",
            logoUrl: payload.logoUrl?.trim() || "",
            regularPrice: Number(payload.regularPrice || 0),
            salePrice: Number(payload.salePrice || 0),
            expiresAt: toOfferExpiration(payload.expiresAt),
            categoryId: Number(payload.categoryId),
            instagram: payload.instagram?.trim() || "",
            facebook: payload.facebook?.trim() || "",
            website: payload.website?.trim() || "",
          }
        : business,
    ),
  });

  return nextData.businesses.find((business) => Number(business.id) === businessId);
}

export async function adminDeleteBusiness(_token, id) {
  const data = getStoredData();
  saveData({
    ...data,
    businesses: data.businesses.filter((business) => Number(business.id) !== Number(id)),
  });
  return null;
}

export async function adminFetchEvents() {
  return sortEvents(getStoredData().events);
}

export async function adminCreateEvent(_token, payload) {
  const data = getStoredData();
  if (!payload.title?.trim() || !payload.description?.trim() || !payload.location?.trim() || !payload.startsAt) {
    return reject("Titulo, descripcion, lugar y fecha de inicio son obligatorios.");
  }

  const nextEvent = {
    id: nextId(data.events),
    title: payload.title.trim(),
    description: payload.description.trim(),
    location: payload.location.trim(),
    startsAt: new Date(payload.startsAt).toISOString(),
    endsAt: payload.endsAt ? new Date(payload.endsAt).toISOString() : null,
    imageUrl: payload.imageUrl?.trim() || "",
  };

  const nextData = saveData({ ...data, events: [...data.events, nextEvent] });
  return nextData.events.find((event) => Number(event.id) === Number(nextEvent.id));
}

export async function adminUpdateEvent(_token, id, payload) {
  const data = getStoredData();
  const eventId = Number(id);
  if (!eventId || !payload.title?.trim() || !payload.description?.trim() || !payload.location?.trim() || !payload.startsAt) {
    return reject("Datos invalidos.");
  }

  const nextData = saveData({
    ...data,
    events: data.events.map((event) =>
      Number(event.id) === eventId
        ? {
            ...event,
            title: payload.title.trim(),
            description: payload.description.trim(),
            location: payload.location.trim(),
            startsAt: new Date(payload.startsAt).toISOString(),
            endsAt: payload.endsAt ? new Date(payload.endsAt).toISOString() : null,
            imageUrl: payload.imageUrl?.trim() || "",
          }
        : event,
    ),
  });

  return nextData.events.find((event) => Number(event.id) === eventId);
}

export async function adminDeleteEvent(_token, id) {
  const data = getStoredData();
  saveData({
    ...data,
    events: data.events.filter((event) => Number(event.id) !== Number(id)),
  });
  return null;
}

export async function adminUploadImage(_token, file) {
  if (!file) return reject("Archivo no recibido.");

  return new Promise((resolve, rejectPromise) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ url: reader.result, filename: file.name });
    reader.onerror = () => rejectPromise(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

export async function adminFetchUsefulPhones() {
  return fetchUsefulPhones();
}

export async function adminCreateUsefulPhone(_token, payload) {
  const data = getStoredData();
  if (!payload.label?.trim() || !payload.number?.trim()) return reject("Etiqueta y numero son obligatorios.");

  const nextPhone = {
    id: nextId(data.usefulPhones),
    label: payload.label.trim(),
    number: payload.number.trim(),
    color: payload.color?.trim() || "#31584c",
    sortOrder: Number(payload.sortOrder || 0),
  };

  const nextData = saveData({ ...data, usefulPhones: [...data.usefulPhones, nextPhone] });
  return nextData.usefulPhones.find((phone) => Number(phone.id) === Number(nextPhone.id));
}

export async function adminUpdateUsefulPhone(_token, id, payload) {
  const data = getStoredData();
  const phoneId = Number(id);
  if (!phoneId || !payload.label?.trim() || !payload.number?.trim()) return reject("Datos invalidos.");

  const nextData = saveData({
    ...data,
    usefulPhones: data.usefulPhones.map((phone) =>
      Number(phone.id) === phoneId
        ? {
            ...phone,
            label: payload.label.trim(),
            number: payload.number.trim(),
            color: payload.color?.trim() || "#31584c",
            sortOrder: Number(payload.sortOrder || 0),
          }
        : phone,
    ),
  });

  return nextData.usefulPhones.find((phone) => Number(phone.id) === phoneId);
}

export async function adminDeleteUsefulPhone(_token, id) {
  const data = getStoredData();
  saveData({
    ...data,
    usefulPhones: data.usefulPhones.filter((phone) => Number(phone.id) !== Number(id)),
  });
  return null;
}
