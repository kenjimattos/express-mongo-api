import express from "express";
import BooksService from "../services/booksService.js";
import BooksController from "../controllers/booksController.js";
import pagination from "../middlewares/pagination.js";

const booksRouter = express.Router();

const booksService = new BooksService();
const booksController = new BooksController(booksService);

booksRouter.get("/books", (req, res, next) => booksController.getBooks(req, res, next), pagination);
booksRouter.get("/books/query", (req, res, next) => booksController.queryBooks(req, res, next), pagination);
booksRouter.get("/books/:id", (req, res, next) => booksController.getBookById(req, res, next));
booksRouter.post("/books", (req, res, next) => booksController.createBook(req, res, next));
booksRouter.put("/books/:id", (req, res, next) => booksController.updateBook(req, res, next));
booksRouter.delete("/books/:id", (req, res, next) => booksController.removeBook(req, res, next));

export default booksRouter;

