const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (username !== adminUser || password !== adminPassword) {
    return res.status(401).json({ message: "Credenciales invalidas." });
  }

  const token = jwt.sign(
    { username, role: "admin" },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "12h" },
  );

  return res.json({
    token,
    user: {
      username,
      role: "admin",
    },
  });
});

module.exports = router;
