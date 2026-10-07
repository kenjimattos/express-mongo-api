import express from "express";
import BookController from "../controllers/bookController.js";
import pagination from "../middlewares/pagination.js";

const bookRoute = express.Router();

bookRoute.get("/book", BookController.getBooks, pagination)
bookRoute.get("/book/query", BookController.queryBooks, pagination);
bookRoute.get("/book/:id", BookController.getBookById)
bookRoute.post("/book", BookController.createBook)
bookRoute.put("/book/:id", BookController.updateBook)
bookRoute.delete("/book/:id", BookController.removeBook)

export default bookRoute;

