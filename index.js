/** @format */

import express from "express";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import ordertRoute from "./routes/orderRoute.js";
import fileUpload from "express-fileupload";
import cors from "cors";
import morgan from "morgan";
const port = 5000;
const app = express();
import mongoose from "mongoose";

mongoose
  .connect("mongodb+srv://puspow:pushpa123@cluster0.2rorvyg.mongodb.net/Trvls")
  .then((val) => {
    app.listen(port, () => {
      console.log("connected server is running");
    });
  });
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    // abortOnLimit: true
  })
);
app.use(cors());
app.use(morgan("common"));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    data: "welcome back master",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", ordertRoute);
