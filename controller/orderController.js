/** @format */

import mongoose from "mongoose";
import Order from "../models/Order.js";
export const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find({}).sort("-createdAt");

    return res.status(201).json({
      status: "success",
      data: orders,
    });
  } catch (err) {
    return res.status(400).json(`${err}`);
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.isValidObjectId(id)) {
      const order = await Order.findById(id).populate("reserved.product user");

      return res.status(200).json({
        status: "success",
        data: order,
      });
    } else {
      return res.status(400).json({
        status: "success",
        message: "please provide valid id",
      });
    }
  } catch (err) {
    return res.status(400).json(`${err}`);
  }
};

export const getOrderByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId });

    return res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (err) {
    return res.status(400).json(`${err}`);
  }
};
export const addOrder = async (req, res) => {
  const { email, totalAmount, reserved } = req.body;

  try {
    const updatedProducts = reserved.map((product) => ({
      qty: product.qty,
      fullName: product.fullName,
      rooms: product.rooms,
      product: product.product,
      placeName: product.placeName,
      placeAddress: product.placeAddress,
      phoneNumber: product.phoneNumber,
      address: product.address,
      checkInDateTime: product.checkInDateTime,
      checkOutDateTime: product.checkInDateTime,
    }));

    // Create order with additional fields
    await Order.create({
      totalAmount,
      reserved: updatedProducts,
      user: req.userId,
      email,
    });

    return res.status(201).json({
      status: "success",
      message: "Order created successfully",
    });
  } catch (err) {
    return res.status(400).json(`${err}`);
  }
};
