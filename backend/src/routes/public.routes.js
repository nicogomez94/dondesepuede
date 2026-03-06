const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

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

    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.get("/businesses", async (req, res, next) => {
  try {
    const { search = "", categoryId } = req.query;
    const where = {};

    if (search) {
      where.name = {
        contains: String(search),
        mode: "insensitive",
      };
    }

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    const businesses = await prisma.business.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { name: "asc" },
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

    if (!business) {
      return res.status(404).json({ message: "Comercio no encontrado." });
    }

    return res.json(business);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
