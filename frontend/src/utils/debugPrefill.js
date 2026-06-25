import { DEBUG_PREFILL_FORMS } from "../config/debug";

export function getDebugCategoryValue() {
  return DEBUG_PREFILL_FORMS ? "Gastronomia" : "";
}

export function getDebugBusinessValues(categoryId = "") {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  return {
    id: null,
    name: DEBUG_PREFILL_FORMS ? "Cafe del Rio" : "",
    description: DEBUG_PREFILL_FORMS
      ? "Promo semanal de brunch para dos con cafe, jugo y pasteleria artesanal."
      : "",
    phone: DEBUG_PREFILL_FORMS ? "+54 9 379 412 3456" : "",
    address: DEBUG_PREFILL_FORMS ? "Av. Principal 245" : "",
    logoUrl: DEBUG_PREFILL_FORMS ? "https://picsum.photos/seed/debug-business/640/480" : "",
    regularPrice: DEBUG_PREFILL_FORMS ? "18500" : "",
    salePrice: DEBUG_PREFILL_FORMS ? "12900" : "",
    expiresAt: DEBUG_PREFILL_FORMS ? expiresAt.toISOString().slice(0, 10) : "",
    categoryId,
    instagram: DEBUG_PREFILL_FORMS ? "https://instagram.com/cafedelrio" : "",
    facebook: DEBUG_PREFILL_FORMS ? "https://facebook.com/cafedelrio" : "",
    website: DEBUG_PREFILL_FORMS ? "https://cafedelrio.local" : "",
  };
}

export function getDebugEventValues() {
  return {
    id: null,
    title: DEBUG_PREFILL_FORMS ? "Feria Gastronomica de Otono" : "",
    description: DEBUG_PREFILL_FORMS
      ? "Puestos locales, musica en vivo y menu degustacion de comercios adheridos."
      : "",
    location: DEBUG_PREFILL_FORMS ? "Anfiteatro Municipal" : "",
    startsAt: DEBUG_PREFILL_FORMS ? "2026-03-15T19:00" : "",
    endsAt: DEBUG_PREFILL_FORMS ? "2026-03-15T23:30" : "",
    imageUrl: DEBUG_PREFILL_FORMS ? "https://picsum.photos/seed/debug-event/960/540" : "",
  };
}
