require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

const CATEGORIES = ["family", "friend", "work", "other"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

// ---------- Middleware----------
function logger(req, res, next) {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.originalUrl}`);
  next();
}

app.use(logger);
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());

// ---------- Helpers ----------
function formatContact(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    category: row.category,
    isFavorite: Boolean(row.is_favorite),
  };
}

function validateContact(body) {
  const errors = {};
  const { fullName, phone, email, address, category } = body ?? {};

  if (typeof fullName !== "string" || fullName.trim().length < 2 || fullName.trim().length > 100) {
    errors.fullName = "Full name must be 2-100 characters.";
  }
  if (typeof phone !== "string" || !PHONE_REGEX.test(phone.trim())) {
    errors.phone = "Enter a valid phone number (7-20 characters: digits, +, -, spaces, parentheses).";
  }
  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim()) || email.trim().length > 150) {
    errors.email = "Enter a valid email address.";
  }
  if (typeof address !== "string" || address.trim().length < 5 || address.trim().length > 255) {
    errors.address = "Address must be 5-255 characters.";
  }
  if (!CATEGORIES.includes(category)) {
    errors.category = `Category must be one of: ${CATEGORIES.join(", ")}.`;
  }
  return errors;
}

function cleanContact(body) {
  return {
    fullName: body.fullName.trim(),
    phone: body.phone.trim(),
    email: body.email.trim(),
    address: body.address.trim(),
    category: body.category,
    isFavorite: Boolean(body.isFavorite),
  };
}

// ---------- Route handlers ----------
async function getContacts(req, res) {
  try {
    const search = String(req.query.search ?? "").trim();
    const category = String(req.query.category ?? "").trim();
    const like = `%${search}%`;

    const [rows] = await pool.query(
      `SELECT * FROM contacts
       WHERE (? = '' OR full_name LIKE ? OR email LIKE ? OR phone LIKE ?)
         AND (? = '' OR category = ?)
       ORDER BY full_name ASC`,
      [search, like, like, like, category, category]
    );

    res.json(rows.map(formatContact));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while loading contacts." });
  }
}

async function getContactById(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM contacts WHERE id = ?", [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Contact not found." });
    }

    res.json(formatContact(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while loading the contact." });
  }
}

async function createContact(req, res) {
  const errors = validateContact(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validation failed.", errors });
  }

  try {
    const contact = cleanContact(req.body);
    const [result] = await pool.query(
      `INSERT INTO contacts (full_name, phone, email, address, category, is_favorite)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [contact.fullName, contact.phone, contact.email, contact.address, contact.category, contact.isFavorite]
    );

    res.status(201).json({ id: result.insertId, ...contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while saving the contact." });
  }
}

async function updateContact(req, res) {
  const errors = validateContact(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validation failed.", errors });
  }

  try {
    const contact = cleanContact(req.body);
    const [result] = await pool.query(
      `UPDATE contacts
       SET full_name = ?, phone = ?, email = ?, address = ?, category = ?, is_favorite = ?
       WHERE id = ?`,
      [contact.fullName, contact.phone, contact.email, contact.address, contact.category, contact.isFavorite, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Contact not found." });
    }

    res.json({ id: Number(req.params.id), ...contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating the contact." });
  }
}

async function deleteContact(req, res) {
  try {
    const [result] = await pool.query("DELETE FROM contacts WHERE id = ?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Contact not found." });
    }

    res.json({ message: "Contact deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while deleting the contact." });
  }
}

// ---------- Routes ----------
app.get("/api/contacts", getContacts);
app.get("/api/contacts/:id", getContactById);
app.post("/api/contacts", createContact);
app.put("/api/contacts/:id", updateContact);
app.delete("/api/contacts/:id", deleteContact);

// ---------- Error handler (e.g. malformed JSON body -> 400) ----------
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON body." });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong." });
});

// ---------- Listen last ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Contact API running on http://localhost:${PORT}`);
});