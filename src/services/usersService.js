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
      throw new BadRequestError("Can't create user: e-mail already registered");
    }

    return userModel.create(data);
  }

  async updateUser(id, data) {
    // Use .save() method so that schema validators, setters, and pre-save hooks (e.g. password hashing) are executed.
    const user = await userModel.findById(id);
    
    if (user === null) return null;
    
    user.set(data);
    return user.save();
  }

  async removeUser(id) {
    return userModel.findByIdAndDelete(id);
  }
}

export default UsersService;