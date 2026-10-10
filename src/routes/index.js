import express from "express";
import authorsRouter from "./authorsRouter.js";
import booksRouter from "./booksRouter.js";
import usersRouter from "./usersRouter.js";

const routes = (app) => {
  app.route("/").get((req, res) => {
    res.status(200).send({ title: "Node API" });
  });

  app.use(express.json(), authorsRouter, booksRouter, usersRouter, );
};

export default routes;