/** @format */

import express from "express";
import {
  userLogin,
  userSignup,
  userUpdate,
} from "../controller/userController.js";
import validator from "express-joi-validation";
import Joi from "joi";

const router = express.Router();

const valid = validator.createValidator({});

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().max(20).required().min(2).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().max(20).required().min(2).required(),
});

const handleAll = (req, res) => {
  return res
    .status(405)
    .json({ status: "error", message: "method not allowed" });
};

router.route("/").get(userLogin).all(handleAll);

router.route("/login").post(valid.body(loginSchema), userLogin).all(handleAll);

router.route("/signup").post(valid.body(userSchema), userSignup).all(handleAll);
router.route("/profile/:id").patch(userUpdate).all(handleAll);

export default router;
