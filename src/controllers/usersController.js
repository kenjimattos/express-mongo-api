import { userModel } from "../models/index.js";
import NotFoundError from "../middlewares/errors/notFoundError.js";

class UsersController {
  static getUsers(req, res, next) {
    try {
      const usersList = userModel.find({});

      req.result = usersList;
      next();
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to list users` });
    }
  }

  static async getUserById(req, res, next) {
    try {
      const id = req.params.id;
      const userDoc = await userModel.findById(id);

      if (userDoc !== null) {
        res.status(200).json(userDoc);
      } else {
        // return res.status(404).json({ message:  });
        next(new NotFoundError("Could not find user. User ID not found"));
      }

    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next) {
    try {
      const newUser = await userModel.create(req.body);
      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const id = req.params.id;
      await userModel.findByIdAndUpdate(id, req.body);
      const updatedUser = await userModel.findById(id);

      if (updatedUser !== null) {
        res.status(201).json({ message: "User updated successfully", user: updatedUser });
      } else {
        next(new NotFoundError("Could not update user. User ID not found"));
      }

    } catch (error) {
      next(error);
    }
  }

  static async removeUser(req, res, next) {
    try {
      const id = req.params.id;
      const deletedUser = await userModel.findByIdAndDelete(id);

      if (deletedUser !== null) {
        res.status(201).json({ message: "User removed successfully", user: deletedUser });
      } else {
        next(new NotFoundError("Could not remove user. User ID not found"));
      }
    } catch (error) {
      next(error);
    }
  }
};

export default UsersController;