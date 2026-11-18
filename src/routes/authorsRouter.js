import express from "express";
import AuthorsController from "../controllers/authorsController.js";
import AuthorsService from "../services/authorsService.js";
import pagination from "../middlewares/pagination.js";

const authorsRouter = express.Router();

const authorsService = new AuthorsService();
const authorsController = new AuthorsController(authorsService);

authorsRouter.get("/authors", (req,res, next) => authorsController.getAuthors(req, res, next), pagination);
authorsRouter.get("/authors/:id", (req,res, next) => authorsController.getAuthorById(req, res, next));
authorsRouter.post("/authors", (req,res, next) => authorsController.createAuthor(req, res, next));
authorsRouter.put("/authors/:id", (req,res, next) => authorsController.updateAuthor(req, res, next));
authorsRouter.delete("/authors/:id", (req,res, next) => authorsController.removeAuthor(req, res, next));

export default authorsRouter;

