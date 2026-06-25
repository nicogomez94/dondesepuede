const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

function buildActiveOfferFilter() {
  return {
    OR: [
      { expiresAt: null },
      { expiresAt: { gte: new Date() } },
    ],
  };
}

function buildEventFilters(query) {
  const { search = "", month = "", status = "" } = query;
  const filters = [];

  if (search) {
    filters.push({
      OR: [
        {
          title: {
            contains: String(search),
            mode: "insensitive",
          },
        },
        {
          location: {
            contains: String(search),
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (month && /^\d{4}-\d{2}$/.test(String(month))) {
    const [year, monthIndex] = String(month).split("-").map(Number);
    const start = new Date(year, monthIndex - 1, 1);
    const end = new Date(year, monthIndex, 1);

    filters.push({
      startsAt: {
        gte: start,
        lt: end,
      },
    });
  }

  const now = new Date();
  if (status === "upcoming") {
    filters.push({
      OR: [
        { endsAt: { gte: now } },
        {
          AND: [{ endsAt: null }, { startsAt: { gte: now } }],
        },
      ],
    });
  }

  if (status === "past") {
    filters.push({
      OR: [
        { endsAt: { lt: now } },
        {
          AND: [{ endsAt: null }, { startsAt: { lt: now } }],
        },
      ],
    });
  }

  if (!filters.length) {
    return {};
  }

  return { AND: filters };
}

router.get("/categories", async (_, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            businesses: {
              where: buildActiveOfferFilter(),
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.get("/businesses", async (req, res, next) => {
  try {
    const { search = "", categoryId } = req.query;
    const filters = [buildActiveOfferFilter()];

    if (search) {
      filters.push({
        OR: [
          { name: { contains: String(search), mode: "insensitive" } },
          { description: { contains: String(search), mode: "insensitive" } },
          { address: { contains: String(search), mode: "insensitive" } },
        ],
      });
    }

    if (categoryId) {
      filters.push({ categoryId: Number(categoryId) });
    }

    const businesses = await prisma.business.findMany({
      where: { AND: filters },
      include: {
        category: true,
      },
      orderBy: [{ expiresAt: "asc" }, { id: "desc" }],
    });

    res.json(businesses);
  } catch (error) {
    next(error);
  }
});

router.get("/businesses/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID invalido." });
    }

    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!business || (business.expiresAt && business.expiresAt < new Date())) {
      return res.status(404).json({ message: "Oferta no encontrada o vencida." });
    }

    return res.json(business);
  } catch (error) {
    return next(error);
  }
});

router.get("/events", async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      where: buildEventFilters(req.query),
      orderBy: [{ startsAt: "asc" }, { id: "asc" }],
    });

    res.json(events);
  } catch (error) {
    next(error);
  }
});

router.get("/useful-phones", async (_, res, next) => {
  try {
    const usefulPhones = await prisma.usefulPhone.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });

    res.json(usefulPhones);
  } catch (error) {
    if (error?.code === "P2021") {
      return res.json([]);
    }
    next(error);
  }
});

module.exports = router;
