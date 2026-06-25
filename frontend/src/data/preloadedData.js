const nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);
nextMonth.setDate(12);
nextMonth.setHours(18, 0, 0, 0);

const followingMonth = new Date(nextMonth);
followingMonth.setMonth(followingMonth.getMonth() + 1);
followingMonth.setDate(4);
followingMonth.setHours(10, 30, 0, 0);

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);
nextWeek.setHours(23, 59, 0, 0);

const midWeek = new Date();
midWeek.setDate(midWeek.getDate() + 4);
midWeek.setHours(20, 0, 0, 0);

export const PRELOADED_CATEGORIES = [
  {
    id: 1,
    name: "Gastronomia",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Comercios",
    imageUrl: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Alojamientos",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Servicios",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  },
];

export const PRELOADED_BUSINESSES = [
  {
    id: 1,
    name: "Cafe Central",
    description: "Combo de cafe con medialunas para arrancar la manana con precio especial.",
    phone: "+54 9 0000 111111",
    address: "Av. Principal 120",
    logoUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80",
    regularPrice: 5800,
    salePrice: 3900,
    expiresAt: nextWeek.toISOString(),
    categoryId: 1,
    instagram: "https://instagram.com",
    facebook: "",
    website: "",
  },
  {
    id: 2,
    name: "Mercado Local",
    description: "Pack de almacen con yerba, fideos y tomate triturado hasta agotar stock.",
    phone: "+54 9 0000 222222",
    address: "Calle Comercial 455",
    logoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
    regularPrice: 11200,
    salePrice: 8490,
    expiresAt: nextWeek.toISOString(),
    categoryId: 2,
    instagram: "",
    facebook: "https://facebook.com",
    website: "",
  },
  {
    id: 3,
    name: "Apart Vista",
    description: "Noche para dos con check-out extendido reservando dentro de la semana.",
    phone: "+54 9 0000 333333",
    address: "Boulevard Norte 78",
    logoUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80",
    regularPrice: 46000,
    salePrice: 34900,
    expiresAt: midWeek.toISOString(),
    categoryId: 3,
    instagram: "",
    facebook: "",
    website: "https://example.com",
  },
  {
    id: 4,
    name: "Soluciones Tecnicas",
    description: "Diagnostico express para notebooks con bonificacion si se confirma la reparacion.",
    phone: "+54 9 0000 444444",
    address: "Pasaje de los Oficios 32",
    logoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
    regularPrice: 12500,
    salePrice: 7900,
    expiresAt: nextWeek.toISOString(),
    categoryId: 4,
    instagram: "",
    facebook: "",
    website: "",
  },
];

export const PRELOADED_EVENTS = [
  {
    id: 1,
    title: "Feria de emprendedores",
    description: "Encuentro abierto con productos regionales, propuestas gastronomicas y musica en vivo.",
    location: "Plaza principal",
    startsAt: nextMonth.toISOString(),
    endsAt: new Date(nextMonth.getTime() + 3 * 60 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Taller para comercios",
    description: "Capacitacion practica sobre atencion al cliente, vidrieras y presencia digital.",
    location: "Salon comunitario",
    startsAt: followingMonth.toISOString(),
    endsAt: new Date(followingMonth.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  },
];

export const PRELOADED_USEFUL_PHONES = [
  { id: 1, color: "#4f6f72", label: "Policia", number: "101", sortOrder: 1 },
  { id: 2, color: "#8b6f5a", label: "Bomberos", number: "100", sortOrder: 2 },
  { id: 3, color: "#5f725f", label: "Ambulancia", number: "107", sortOrder: 3 },
  { id: 4, color: "#6f766f", label: "Defensa Civil", number: "103", sortOrder: 4 },
];

export const PRELOADED_DATA = {
  categories: PRELOADED_CATEGORIES,
  businesses: PRELOADED_BUSINESSES,
  events: PRELOADED_EVENTS,
  usefulPhones: PRELOADED_USEFUL_PHONES,
};
