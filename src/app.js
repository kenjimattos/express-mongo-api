import express from "express";
import connectDatabase from "./config/dbConnect.js";
import routes from "./routes/index.js";

const dbConnect = await connectDatabase();

dbConnect.on("error", (erro) => {
  console.error("Database connection error", erro);
});

dbConnect.once("open", () => {
  console.log("Database successfully connected");
})

const app = express();
routes(app);

export default app;