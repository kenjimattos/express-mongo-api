import express from "express";
import authorRoute from "./authorRoute.js";
import bookRoute from "./bookRoute.js";
import userRoute from "./userRoute.js";

const routes = (app) => {
  app.route("/").get((req, res) => {
    res.status(200).send({ title: "Node API" });
  });

  app.use(express.json(), authorRoute, bookRoute, userRoute, );
};

export default routes;