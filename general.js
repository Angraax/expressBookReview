const axios = require("axios");

const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:3000"
});

async function getAllBooks() {
  const response = await api.get("/books");
  return response.data;
}

async function getBooksByISBN(isbn) {
  const response = await api.get(`/books/isbn/${encodeURIComponent(isbn)}`);
  return response.data;
}

async function getBooksByAuthor(author) {
  const response = await api.get(`/books/author/${encodeURIComponent(author)}`);
  return response.data;
}

async function getBooksByTitle(title) {
  const response = await api.get(`/books/title/${encodeURIComponent(title)}`);
  return response.data;
}

module.exports = {
  getAllBooks,
  getBooksByISBN,
  getBooksByAuthor,
  getBooksByTitle
};
