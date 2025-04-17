import express from "express";
import { createProductsfunc, deleteProductsfunc, getProductsfunc, updateProductsfunc } from "../Controllers/product.controller.js";
import userVerify from "../Middlewares/user.auth.js";

const productRouter = express.Router();

productRouter.get("/get", userVerify(["admin", "user"]), getProductsfunc);
productRouter.post("/create", userVerify("admin"), createProductsfunc);
productRouter.put("/update/:id", userVerify("admin"), updateProductsfunc);
productRouter.delete("/delete/:id", userVerify("admin"), deleteProductsfunc);

export default productRouter;
