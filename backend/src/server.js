require("dotenv").config();

const app = require("./app");
const prisma = require("./config/prisma");

const port = Number(process.env.PORT) || 4000;

async function start() {
  try {
    await prisma.$connect();
    app.listen(port, () => {
      console.log(`API escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar la API:", error);
    process.exit(1);
  }
}

start();
