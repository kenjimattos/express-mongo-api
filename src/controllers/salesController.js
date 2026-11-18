import NotFoundError from "../middlewares/errors/notFoundError.js";

class SalesController {
  constructor(salesService) {
    this.salesService = salesService;
  }
  getSales(req, res, next) {
    try {
      const booksList = this.salesService.getSales();

      req.result = booksList;
      next();
    } catch (error) {
      next(error);
    }
  }

  async getSaleById(req, res, next) {
    try {
      const id = req.params.id;
      const saleData = await this.salesService.getSaleById(id);

      if (saleData !== null) {
        res.status(200).json(saleData);
      } else {
        next(new NotFoundError("Could not find sale. Sale ID not found"));
      }
    } catch (error) {
      next(error);
    }
  }

  async createSale(req, res, next) {
    try {
      const createdSale = await this.salesService.createSale(req.body);

      res
        .status(201)
        .json({ message: "Sale created successfully", sale: createdSale });
    } catch (error) {
      next(error);
    }
  }

  async removeSale(req, res, next) {
    try {
      const id = req.params.id;
      const deletedSale = await this.salesService.removeSale(id);

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
