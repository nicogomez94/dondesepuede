import { DEBUG_PREFILL_FORMS } from "../config/debug";

export function getDebugLoginValues() {
  if (!DEBUG_PREFILL_FORMS) {
    return {
      username: "",
      password: "",
    };
  }

  return {
    username: "admin",
    password: "admin123",
  };
}

export function getDebugCategoryValue() {
  return DEBUG_PREFILL_FORMS ? "Gastronomia" : "";
}

export function getDebugBusinessValues(categoryId = "") {
  return {
    id: null,
    name: DEBUG_PREFILL_FORMS ? "Cafe del Rio" : "",
    description: DEBUG_PREFILL_FORMS
      ? "Especialidad en cafe, brunch y pasteleria artesanal frente a la costanera."
      : "",
    phone: DEBUG_PREFILL_FORMS ? "+54 9 379 412 3456" : "",
    address: DEBUG_PREFILL_FORMS ? "Av. Costanera 245, Paso de la Patria" : "",
    logoUrl: DEBUG_PREFILL_FORMS ? "https://picsum.photos/seed/debug-business/640/480" : "",
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
