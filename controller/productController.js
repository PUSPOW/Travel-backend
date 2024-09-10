/** @format */
import Product from "../models/Product.js";
import mongoose from "mongoose";
import fs from "fs";
export const getTopProducts = async (req, res, next) => {
  req.query = { rating: { $gt: 4.5 }, limit: 5 };
  next();
};

export const getProducts = async (req, res) => {
  const objFields = ["sort", "search", "fields", "page", "limit"];
  try {
    const queryObject = { ...req.query };

    // Remove fields that are used for query options
    objFields.forEach((ele) => delete queryObject[ele]);

    // Handle search for both product_name and product_place
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i"); // Case-insensitive search
      queryObject.$or = [
        { product_name: searchRegex },
        { product_place: searchRegex },
      ];
    }

    // Initialize query
    let query = Product.find(queryObject);

    // Handle sorting
    if (req.query.sort) {
      const sorts = req.query.sort.split(",").join(" ");
      query = query.sort(sorts);
    }

    // Handle field selection
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    }

    // Handle pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit; // Adjusted to use the limit value
    query = query.skip(skip).limit(limit);

    // Execute query
    const products = await query;

    // Respond with products
    return res.status(200).json({
      status: "success",
      length: products.length,
      data: products,
    });
  } catch (err) {
    // Respond with error
    return res.status(400).json({ status: "error", message: err.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.isValidObjectId(id)) {
      const product = await Product.findById(id).populate({
        path: "reviews.user",
        select: "username",
      });
      return res.status(200).json({
        status: "success",
        data: product,
      });
    }
    return res.status(400).json({
      status: "error",
      message: "please provide valid id",
    });
  } catch (err) {
    return res.status(400).json({ status: "error", message: `${err}` });
  }
};

export const addProduct = async (req, res) => {
  const {
    product_name,
    product_detail,
    product_price,
    available,
    numReviews,
    product_place,
  } = req.body;
  try {
    await Product.create({
      product_name,
      product_image: req.imagePath,
      product_detail,
      product_price,
      available,
      numReviews,
      product_place,
    });
    return res.status(200).json({
      status: "success",
      message: "product added",
    });
  } catch (err) {
    fs.unlink(`.${req.imagePath}`, (err) => console.log(err));
    return res.status(400).json({ status: "error", message: `${err}` });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const imagePath = req.imagePath;
  const {
    product_name,
    product_detail,
    product_price,
    available,
    numReviews,
    product_place,
  } = req.body;
  try {
    if (imagePath) {
      await Product.findByIdAndUpdate(id, {
        product_name,
        product_image: req.imagePath,
        product_detail,
        product_price,
        available,
        numReviews,
        product_place,
      });
    } else {
      await Product.findByIdAndUpdate(id, {
        product_name,
        product_detail,
        product_price,
        available,
        numReviews,
        product_place,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "product updated",
    });
  } catch (err) {
    fs.unlink(`.${req.imagePath}`, (err) => console.log(err));
    return res.status(400).json({ status: "error", message: `${err}` });
  }
};

export const addReview = async (req, res) => {
  const { id } = req.params;

  const { comment, rating } = req.body;

  try {
    const isExist = await Product.findById(id);
    if (isExist) {
      const review = isExist.reviews.find(
        (rev) => rev.user.toString() === req.userId
      );
      if (review)
        return res
          .status(400)
          .json({ status: "error", message: `already reviewed` });
      isExist.reviews.push({
        user: req.userId,
        rating,
        comment,
      });
      const total = isExist.reviews.reduce((a, b) => a + b.rating, 0);
      isExist.numReviews = isExist.reviews.length;
      isExist.rating = total / isExist.reviews.length;

      await isExist.save();

      return res
        .status(200)
        .json({ status: "succes", message: `review added successfully` });
    } else {
      return res
        .status(404)
        .json({ status: "error", message: `product not found` });
    }
  } catch (err) {
    return res.status(400).json({ status: "error", message: `${err}` });
  }
};

export const removeProduct = async (req, res) => {
  const { id } = req.params;
  const { imagePath } = req.query.imagePath;
  try {
    await Product.findByIdAndDelete(id);
    fs.unlink(`.${imagePath}`, (err) => console.log(err));
    return res.status(200).json({
      status: "success",
      message: "product removed",
    });
  } catch (err) {
    return res.status(400).json({ status: "error", message: `${err}` });
  }
};
