import express from "express";
import BooksController from "../controllers/booksController.js";
import pagination from "../middlewares/pagination.js";

const booksRouter = express.Router();

booksRouter.get("/books", BooksController.getBooks, pagination)
booksRouter.get("/books/query", BooksController.queryBooks, pagination);
booksRouter.get("/books/:id", BooksController.getBookById)
booksRouter.post("/books", BooksController.createBook)
booksRouter.put("/books/:id", BooksController.updateBook)
booksRouter.delete("/books/:id", BooksController.removeBook)

export default booksRouter;

