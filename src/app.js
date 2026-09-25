import express from "express";
import connectDatabase from "./config/dbConnect.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
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

app.use(notFoundHandler);
app.use(errorHandler);

export default app;