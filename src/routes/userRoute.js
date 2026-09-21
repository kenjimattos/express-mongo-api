import express from "express";
import UserController from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.get("/user", UserController.getUsers)
userRoute.get("/user/:id", UserController.getUserById)
userRoute.post("/user", UserController.createUser)
userRoute.put("/user/:id", UserController.updateUser)
userRoute.delete("/user/:id", UserController.removeUser)

export default userRoute;

