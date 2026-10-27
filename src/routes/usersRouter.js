import express from "express";
import UsersController from "../controllers/usersController.js";
import pagination from "../middlewares/pagination.js";

const usersRouter = express.Router();

usersRouter.get("/users", (req, res, next) => UsersController.getUsers(req, res, next), pagination);
usersRouter.get("/users/:id", (req, res, next) => UsersController.getUserById(req, res, next));
usersRouter.post("/users", (req, res, next) => UsersController.createUser(req, res, next));
usersRouter.put("/users/:id", (req, res, next) => UsersController.updateUser(req, res, next));
usersRouter.delete("/users/:id", (req, res, next) => UsersController.removeUser(req, res, next));

export default usersRouter;

