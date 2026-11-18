import NotFoundError from "../middlewares/errors/notFoundError.js";

class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }
  
  getUsers(req, res, next) {
    try {
      const usersList = this.usersService.getUsers();

      req.result = usersList;
      next();
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const id = req.params.id;
      const userDoc = await this.usersService.getUserById(id);

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

  async createUser(req, res, next) {
    try {
      const newUser = await this.usersService.createUser(req.body);
      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const id = req.params.id;
      const updatedUser = await this.usersService.updateUser(id, req.body);

      if (updatedUser !== null) {
        res.status(201).json({ message: "User updated successfully", user: updatedUser });
      } else {
        next(new NotFoundError("Could not update user. User ID not found"));
      }
    } catch (error) {
      next(error);
    }
  }

  async removeUser(req, res, next) {
    try {
      const id = req.params.id;
      const deletedUser = await this.usersService.removeUser(id);

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