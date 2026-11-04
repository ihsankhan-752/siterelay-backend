import express from "express";
import { connectDB } from "./config/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(errorMiddleware);

app.use();
connectDB().then(() =>
  app.listen(process.env.PORT, () => {
    console.log("Server is Up and Running on PORT: ", process.env.PORT);
  }),
);
