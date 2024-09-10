/** @format */

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    reserved: [
      {
        qty: { type: Number, required: true },
        rooms: { type: Number, required: true },
        fullName: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        phoneNumber: {
          type: Number,
          required: true,
        },
        placeName: {
          type: String,
          required: true,
        },
        placeAddress: {
          type: String,
          required: true,
        },
        checkInDateTime: {
          type: Date,
          required: true,
        },
        checkOutDateTime: {
          type: Date,
          required: true,
        },
        product: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
