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

function parseEventPayload(body) {
  return {
    title: body.title?.trim(),
    description: body.description?.trim() || "",
    location: body.location?.trim() || "",
    startsAt: body.startsAt ? new Date(body.startsAt) : null,
    endsAt: body.endsAt ? new Date(body.endsAt) : null,
    imageUrl: body.imageUrl?.trim() || body.image_url?.trim() || null,
  };
}

function validateEventPayload(payload) {
  if (!payload.title || !payload.description || !payload.location || !payload.startsAt) {
    return "Titulo, descripcion, lugar y fecha de inicio son obligatorios.";
  }

  if (Number.isNaN(payload.startsAt.getTime())) {
    return "La fecha de inicio es invalida.";
  }

  if (payload.endsAt && Number.isNaN(payload.endsAt.getTime())) {
    return "La fecha de fin es invalida.";
  }

  if (payload.endsAt && payload.endsAt < payload.startsAt) {
    return "La fecha de fin no puede ser anterior al inicio.";
  }

  return null;
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

router.get("/events", async (_, res, next) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: [{ startsAt: "asc" }, { id: "desc" }],
    });

    return res.json(events);
  } catch (error) {
    return next(error);
  }
});

router.post("/events", async (req, res, next) => {
  try {
    const payload = parseEventPayload(req.body);
    const validationError = validateEventPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const event = await prisma.event.create({
      data: payload,
    });

    return res.status(201).json(event);
  } catch (error) {
    return next(error);
  }
});

router.put("/events/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const payload = parseEventPayload(req.body);
    const validationError = validateEventPayload(payload);

    if (!id) {
      return res.status(400).json({ message: "ID invalido." });
    }

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const event = await prisma.event.update({
      where: { id },
      data: payload,
    });

    return res.json(event);
  } catch (error) {
    return next(error);
  }
});

router.delete("/events/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID invalido." });
    }

    await prisma.event.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
