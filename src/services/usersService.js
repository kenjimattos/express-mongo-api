import { userModel } from "../models/index.js";
import BadRequestError from "../middlewares/errors/badRequestError.js";

class UsersService {
  getUsers() {
    return userModel.find({});
  }

  async getUserById(id) {
    return userModel.findById(id);
  }

  async createUser(data) {
    const existing = await userModel.findOne({ email: data.email });
    
    if (existing) {
      throw new BadRequestError("Email already registered");
    }

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