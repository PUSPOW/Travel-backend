/** @format */

import express from "express";
import {
  addProduct,
  addReview,
  getProductById,
  getProducts,
  getTopProducts,
  removeProduct,
  updateProduct,
} from "../controller/productController.js";
import { fileCheck, updateFile } from "../middleware/fileCheck.js";
import { adminCheck, userCheck } from "../middleware/checkUser.js";

const router = express.Router();

const handleAll = (req, res) => {
  return res
    .status(405)
    .json({ status: "error", message: "method not allowed" });
};

router
  .route("/")
  .get(getProducts)
  .post(userCheck, adminCheck, fileCheck, addProduct)
  .all(handleAll);
router.route("/top_products").get(getTopProducts, getProducts).all(handleAll);
router.route("/reviews/:id").patch(userCheck, addReview).all(handleAll);

router
  .route("/:id")
  .get(getProductById)
  .patch(userCheck, adminCheck, updateFile, updateProduct)
  .delete(userCheck, adminCheck, removeProduct)
  .all(handleAll);

export default router;
