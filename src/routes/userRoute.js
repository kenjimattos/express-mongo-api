import express from "express";
import UserController from "../controllers/userController.js";
import pagination from "../middlewares/pagination.js";

const userRoute = express.Router();

userRoute.get("/user", UserController.getUsers, pagination)
userRoute.get("/user/:id", UserController.getUserById)
userRoute.post("/user", UserController.createUser)
userRoute.put("/user/:id", UserController.updateUser)
userRoute.delete("/user/:id", UserController.removeUser)

export default userRoute;

