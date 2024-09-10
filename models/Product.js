/** @format */

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_image: {
      type: String,
      required: true,
    },
    product_detail: {
      type: String,
      required: true,
    },
    product_place: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },
    available: {
      type: String,
      required: true,
    },
    reviews: [
      {
        comment: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        user: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
