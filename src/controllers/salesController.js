import SalesService from "../services/salesService.js";
import NotFoundError from "../middlewares/errors/notFoundError.js";

const salesService = new SalesService();

class SalesController {
  static getSales(req, res, next) {
    try {
      const booksList = salesService.getSales();

      req.result = booksList;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getSaleById(req, res, next) {
    try {
      const id = req.params.id;
      const saleData = await salesService.getSaleById(id);

      if (saleData !== null) {
        res.status(200).json(saleData);
      } else {
        next(new NotFoundError("Could not find sale. Sale ID not found"));
      }
    } catch (error) {
      next(error);
    }
  }

  static async createSale(req, res, next) {
    try {
      const createdSale = await salesService.createSale(req.body);

      res
        .status(201)
        .json({ message: "Sale created successfully", sale: createdSale });
    } catch (error) {
      next(error);
    }
  }

  static async removeSale(req, res, next) {
    try {
      const id = req.params.id;
      const deletedSale = await salesService.removeSale(id);

      if (deletedSale !== null) {
        res
          .status(201)
          .json({ message: "Sale removed successfully", sale: deletedSale });
      } else {
        next(new NotFoundError("Could not remove sale. Sale ID not found"));
      }
    } catch (error) {
      next(error);
    }
  }
}

export default SalesController;
