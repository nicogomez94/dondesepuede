const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const categorySeeds = [
    {
      name: "Comercios",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Alojamientos",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Servicios",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Gastronomia",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
    },
  ];

  for (const category of categorySeeds) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { imageUrl: category.imageUrl },
      create: category,
    });
  }

  const categories = await prisma.category.findMany();
  const categoriesByName = categories.reduce((acc, category) => {
    acc[category.name] = category.id;
    return acc;
  }, {});

  const businessSeeds = [
    {
      name: "Panaderia Central",
      description: "Panificados artesanales y cafetera de especialidad.",
      phone: "+54 9 11 5555 1111",
      address: "Av. San Martin 321",
      logoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
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
      logoUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
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
      logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      categoryId: categoriesByName.Servicios,
      instagram: "https://instagram.com/tecnicoexpress",
      facebook: "https://facebook.com/tecnicoexpress",
      website: "https://tecnicoexpress.local",
    },
  ];

  for (const business of businessSeeds) {
    const existingBusiness = await prisma.business.findFirst({
      where: { name: business.name },
    });

    if (existingBusiness) {
      await prisma.business.update({
        where: { id: existingBusiness.id },
        data: business,
      });
    } else {
      await prisma.business.create({ data: business });
    }
  }

  const now = new Date();
  const upcomingEvents = [
    {
      title: "Feria Gastronomica Costera",
      description: "Productores, food trucks y musica en vivo frente al rio.",
      location: "Anfiteatro Municipal",
      startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 19, 0),
      endsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 30),
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Expo Emprendedores Locales",
      description: "Muestra comercial con emprendimientos y promociones especiales.",
      location: "Centro de Convenciones",
      startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15, 10, 0),
      endsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15, 20, 0),
      imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Festival de Temporada",
      description: "Shows en vivo, actividades familiares y paseo de artesanos.",
      location: "Playa Bahia Punta Mitre",
      startsAt: new Date(now.getFullYear(), now.getMonth() + 1, 5, 18, 30),
      endsAt: new Date(now.getFullYear(), now.getMonth() + 1, 5, 23, 59),
      imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  for (const event of upcomingEvents) {
    const existingEvent = await prisma.event.findFirst({
      where: { title: event.title },
    });

    if (existingEvent) {
      await prisma.event.update({
        where: { id: existingEvent.id },
        data: event,
      });
    } else {
      await prisma.event.create({ data: event });
    }
  }

  const usefulPhoneCount = await prisma.usefulPhone.count();
  if (usefulPhoneCount === 0) {
    await prisma.usefulPhone.createMany({
      data: [
        { label: "Policia", number: "101", color: "#2563eb", sortOrder: 1 },
        { label: "Bomberos", number: "100", color: "#dc2626", sortOrder: 2 },
        { label: "Ambulancia", number: "107", color: "#16a34a", sortOrder: 3 },
        { label: "Defensa Civil", number: "103", color: "#7c3aed", sortOrder: 4 },
      ],
    });
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
