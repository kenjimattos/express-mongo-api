import express from "express";
import SalesController from "../controllers/salesController.js";
import pagination from "../middlewares/pagination.js";

const salesRouter = express.Router();

salesRouter.get("/sales", SalesController.getSales, pagination);
salesRouter.get("/sales/:id", SalesController.getSaleById);
salesRouter.post("/sales", SalesController.createSale);
salesRouter.delete("/sales/:id", SalesController.removeSale);

export default salesRouter;

