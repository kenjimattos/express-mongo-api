import express from "express";
import AuthorsController from "../controllers/authorsController.js";
import pagination from "../middlewares/pagination.js";

const authorsRouter = express.Router();

authorsRouter.get("/authors", AuthorsController.getAuthors, pagination)
authorsRouter.get("/authors/:id", AuthorsController.getAuthorById)
authorsRouter.post("/authors", AuthorsController.createAuthor)
authorsRouter.put("/authors/:id", AuthorsController.updateAuthor)
authorsRouter.delete("/authors/:id", AuthorsController.removeAuthor)

export default authorsRouter;

