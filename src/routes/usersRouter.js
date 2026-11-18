import express from "express";
import UsersController from "../controllers/usersController.js";
import pagination from "../middlewares/pagination.js";
import UsersService from "../services/usersService.js";

const usersRouter = express.Router();

const usersService = new UsersService();
const usersController = new UsersController(usersService);

usersRouter.get("/users", (req, res, next) => usersController.getUsers(req, res, next), pagination);
usersRouter.get("/users/:id", (req, res, next) => usersController.getUserById(req, res, next));
usersRouter.post("/users", (req, res, next) => usersController.createUser(req, res, next));
usersRouter.put("/users/:id", (req, res, next) => usersController.updateUser(req, res, next));
usersRouter.delete("/users/:id", (req, res, next) => usersController.removeUser(req, res, next));

export default usersRouter;

