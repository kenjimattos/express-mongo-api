import express from "express";
import authorController from "../controllers/authorController.js";
import pagination from "../middlewares/pagination.js";

const authorRoute = express.Router();

authorRoute.get("/author", authorController.getAuthors, pagination)
authorRoute.get("/author/:id", authorController.getAuthorById)
authorRoute.post("/author", authorController.createAuthor)
authorRoute.put("/author/:id", authorController.updateAuthor)
authorRoute.delete("/author/:id", authorController.removeAuthor)

export default authorRoute;

