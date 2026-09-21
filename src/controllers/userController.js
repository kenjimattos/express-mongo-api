import userModel from "../models/userModel.js";

class UserController {
  static async getUsers(req, res) {
    try {
      const usersList = await userModel.find({});
      res.status(200).json(usersList);
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to list users` });
    }
  }
  static async getUserById(req, res) {
    try {
      const id  = req.params.id;
      const userDoc = await userModel.findById(id);
      res.status(200).json(userDoc);
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to find user` });
    }
  }
  static async createUser(req, res) {
    try {
      const newUser = await userModel.create(req.body);
      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to create user` });
    }
  }
  static async updateUser(req, res) {
    try {
      const id  = req.params.id;
      await userModel.findByIdAndUpdate(id, req.body);
      const updatedUser = await userModel.findById(id);
      res.status(201).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to update user` });
    }
  }
  static async removeUser(req, res) {
    try {
      const id  = req.params.id;
      const deletedUser = await userModel.findByIdAndDelete(id);
      res.status(201).json({ message: "User removed successfully", user: deletedUser });
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to remove user` });
    }
  }
};

export default UserController;