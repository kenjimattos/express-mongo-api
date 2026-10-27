import { userModel } from "../models/index.js";

class UsersService {
  getUsers() {
    return userModel.find({});
  }

  async getUserById(id) {
    return userModel.findById(id);
  }

  async createUser(data) {
    return userModel.create(data);
  }

  async updateUser(id, data) {
    return userModel.findByIdAndUpdate(id, data, { new: true });
  }

  async removeUser(id) {
    return userModel.findByIdAndDelete(id);
  }
}

export default UsersService;