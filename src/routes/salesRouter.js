import express from "express";
import SalesController from "../controllers/salesController.js";
import SalesService from "../services/salesService.js";
import pagination from "../middlewares/pagination.js";

const salesRouter = express.Router();

const salesService = new SalesService();
const salesController = new SalesController(salesService);

salesRouter.get("/sales", (req, res, next) => salesController.getSales(req, res, next), pagination);
salesRouter.get("/sales/:id", (req, res, next) => salesController.getSaleById(req, res, next));
salesRouter.post("/sales", (req, res, next) => salesController.createSale(req, res, next));
salesRouter.delete("/sales/:id", (req, res, next) => salesController.removeSale(req, res, next));

export default salesRouter;