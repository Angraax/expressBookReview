const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const books = require("./books.json");

const app = express();
const port = Number(process.env.PORT) || 3000;
const jwtSecret = process.env.JWT_SECRET || "development-only-change-this-secret";
const users = new Map();

app.use(express.json());

function findBook(isbn) {
  return books.find((book) => book.isbn === isbn);
}

function sendBookNotFound(res) {
  return res.status(404).json({ error: "Book not found" });
}

function authenticate(req, res, next) {
  const header = req.get("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    req.user = jwt.verify(header.slice(7), jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/isbn/:isbn", (req, res) => {
  const book = findBook(req.params.isbn);
  return book ? res.json(book) : sendBookNotFound(res);
});

app.get("/books/author/:author", (req, res) => {
  const author = decodeURIComponent(req.params.author).toLowerCase();
  const matches = books.filter((book) => book.author.toLowerCase().includes(author));
  return res.json(matches);
});

app.get("/books/title/:title", (req, res) => {
  const title = decodeURIComponent(req.params.title).toLowerCase();
  const matches = books.filter((book) => book.title.toLowerCase().includes(title));
  return res.json(matches);
});

app.get("/books/:isbn/review", (req, res) => {
  const book = findBook(req.params.isbn);
  return book ? res.json(book.reviews) : sendBookNotFound(res);
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  if (users.has(username)) {
    return res.status(409).json({ error: "User already exists" });
  }

  users.set(username, await bcrypt.hash(password, 10));
  return res.status(201).json({ message: "User registered successfully" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  const passwordHash = users.get(username);
  if (!passwordHash || typeof password !== "string" || !(await bcrypt.compare(password, passwordHash))) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });
  return res.json({ message: "Login successful", token });
});

app.put("/auth/review/:isbn", authenticate, (req, res) => {
  const book = findBook(req.params.isbn);
  if (!book) {
    return sendBookNotFound(res);
  }
  const { review } = req.body || {};
  if (typeof review !== "string" || !review.trim()) {
    return res.status(400).json({ error: "Review text is required" });
  }

  book.reviews[req.user.username] = review.trim();
  return res.json({ message: "Review added or updated successfully", reviews: book.reviews });
});

app.delete("/auth/review/:isbn", authenticate, (req, res) => {
  const book = findBook(req.params.isbn);
  if (!book) {
    return sendBookNotFound(res);
  }
  if (!Object.prototype.hasOwnProperty.call(book.reviews, req.user.username)) {
    return res.status(404).json({ error: "Review not found" });
  }

  delete book.reviews[req.user.username];
  return res.json({ message: "Review deleted successfully", reviews: book.reviews });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Book review API listening on port ${port}`);
  });
}

module.exports = app;
