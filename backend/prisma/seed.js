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
