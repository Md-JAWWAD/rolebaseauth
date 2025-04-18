import express from "express";
import mongoose from "mongoose";
import userRoute from "./Route/user.route.js";
import productRoute from "./Route/product.route.js";
import env from "dotenv";
import cors from "cors";
env.config();

const PORT = process.env.PORT || 2090;
const DBURL = process.env.DB;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", userRoute);
app.use("/product", productRoute);


mongoose
  .connect(DBURL)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Mongoose Connected. Server ${PORT} runs... `)
    )
  )
  .catch((error) => console.log(`message: ${error}`));
