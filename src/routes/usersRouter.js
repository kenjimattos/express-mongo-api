import express from "express";
import UsersController from "../controllers/usersController.js";
import pagination from "../middlewares/pagination.js";

const usersRouter = express.Router();

usersRouter.get("/users", UsersController.getUsers, pagination)
usersRouter.get("/users/:id", UsersController.getUserById)
usersRouter.post("/users", UsersController.createUser)
usersRouter.put("/users/:id", UsersController.updateUser)
usersRouter.delete("/users/:id", UsersController.removeUser)

export default usersRouter;

