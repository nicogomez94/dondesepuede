const express = require("express");
const prisma = require("../config/prisma");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

function parseBusinessPayload(body) {
  return {
    name: body.name?.trim(),
    description: body.description?.trim() || "",
    phone: body.phone?.trim() || null,
    address: body.address?.trim() || null,
    logoUrl: body.logoUrl?.trim() || body.logo_url?.trim() || null,
    categoryId: Number(body.categoryId || body.category_id),
    instagram: body.instagram?.trim() || null,
    facebook: body.facebook?.trim() || null,
    website: body.website?.trim() || null,
  };
}

router.get("/categories", async (_, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { businesses: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return res.json(categories);
  } catch (error) {
    return next(error);
  }
});

router.post("/categories", async (req, res, next) => {
  try {
    const name = req.body.name?.trim();

    if (!name) {
      return res.status(400).json({ message: "El nombre es obligatorio." });
    }

    const category = await prisma.category.create({ data: { name } });
    return res.status(201).json(category);
  } catch (error) {
    return next(error);
  }
});

router.put("/categories/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const name = req.body.name?.trim();

    if (!id || !name) {
      return res.status(400).json({ message: "Datos invalidos." });
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return res.json(category);
  } catch (error) {
    return next(error);
  }
});

router.delete("/categories/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID invalido." });
    }

    const businessCount = await prisma.business.count({ where: { categoryId: id } });
    if (businessCount > 0) {
      return res.status(409).json({
        message: "No se puede eliminar una categoria con comercios asociados.",
      });
    }

    await prisma.category.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

router.get("/businesses", async (_, res, next) => {
  try {
    const businesses = await prisma.business.findMany({
      include: { category: true },
      orderBy: { id: "desc" },
    });

    return res.json(businesses);
  } catch (error) {
    return next(error);
  }
});

router.post("/businesses", async (req, res, next) => {
  try {
    const payload = parseBusinessPayload(req.body);

    if (!payload.name || !payload.categoryId) {
      return res.status(400).json({ message: "Nombre y categoria son obligatorios." });
    }

    const business = await prisma.business.create({
      data: payload,
      include: { category: true },
    });

    return res.status(201).json(business);
  } catch (error) {
    return next(error);
  }
});

router.put("/businesses/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const payload = parseBusinessPayload(req.body);

    if (!id || !payload.name || !payload.categoryId) {
      return res.status(400).json({ message: "Datos invalidos." });
    }

    const business = await prisma.business.update({
      where: { id },
      data: payload,
      include: { category: true },
    });

    return res.json(business);
  } catch (error) {
    return next(error);
  }
});

router.delete("/businesses/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID invalido." });
    }

    await prisma.business.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
