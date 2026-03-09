const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const categoryNames = ["Comercios", "Alojamientos", "Servicios", "Gastronomia"];

  await prisma.category.createMany({
    data: categoryNames.map((name) => ({ name })),
    skipDuplicates: true,
  });

  const categories = await prisma.category.findMany();
  const categoriesByName = categories.reduce((acc, category) => {
    acc[category.name] = category.id;
    return acc;
  }, {});

  await prisma.business.createMany({
    data: [
      {
        name: "Panaderia Central",
        description: "Panificados artesanales y cafetera de especialidad.",
        phone: "+54 9 11 5555 1111",
        address: "Av. San Martin 321",
        logoUrl: "https://placehold.co/300x220?text=Panaderia",
        categoryId: categoriesByName.Comercios,
        instagram: "https://instagram.com/panaderiacentral",
        facebook: "https://facebook.com/panaderiacentral",
        website: "https://panaderiacentral.local",
      },
      {
        name: "Hotel Plaza",
        description: "Alojamiento centrico para turismo y viajes de negocio.",
        phone: "+54 9 11 5555 2222",
        address: "Belgrano 88",
        logoUrl: "https://placehold.co/300x220?text=Hotel",
        categoryId: categoriesByName.Alojamientos,
        instagram: "https://instagram.com/hotelplaza",
        facebook: "https://facebook.com/hotelplaza",
        website: "https://hotelplaza.local",
      },
      {
        name: "Tecnico Express",
        description: "Servicio tecnico de PC, notebooks e impresoras.",
        phone: "+54 9 11 5555 3333",
        address: "Rivadavia 1200",
        logoUrl: "https://placehold.co/300x220?text=Servicio",
        categoryId: categoriesByName.Servicios,
        instagram: "https://instagram.com/tecnicoexpress",
        facebook: "https://facebook.com/tecnicoexpress",
        website: "https://tecnicoexpress.local",
      },
    ],
    skipDuplicates: true,
  });

  const now = new Date();
  const upcomingEvents = [
    {
      title: "Feria Gastronomica Costera",
      description: "Productores, food trucks y musica en vivo frente al rio.",
      location: "Anfiteatro Municipal",
      startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 19, 0),
      endsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 30),
      imageUrl: "https://placehold.co/900x600?text=Feria+Gastronomica",
    },
    {
      title: "Expo Emprendedores Locales",
      description: "Muestra comercial con emprendimientos y promociones especiales.",
      location: "Centro de Convenciones",
      startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15, 10, 0),
      endsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15, 20, 0),
      imageUrl: "https://placehold.co/900x600?text=Expo+Emprendedores",
    },
    {
      title: "Festival de Temporada",
      description: "Shows en vivo, actividades familiares y paseo de artesanos.",
      location: "Playa Bahia Punta Mitre",
      startsAt: new Date(now.getFullYear(), now.getMonth() + 1, 5, 18, 30),
      endsAt: new Date(now.getFullYear(), now.getMonth() + 1, 5, 23, 59),
      imageUrl: "https://placehold.co/900x600?text=Festival+de+Temporada",
    },
  ];

  for (const event of upcomingEvents) {
    const existingEvent = await prisma.event.findFirst({
      where: {
        title: event.title,
        startsAt: event.startsAt,
      },
    });

    if (!existingEvent) {
      await prisma.event.create({ data: event });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
