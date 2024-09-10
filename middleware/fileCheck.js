/** @format */

import path from "path";
import fs from "fs";
const supports = [".png", ".jpg", "jpeg"];

export const fileCheck = (req, res, next) => {
  const file = req.files?.product_image;
  try {
    if (file) {
      const val = path.extname(file.name);
      if (!supports.includes(val))
        return res.status(400).json({
          status: "error",
          message: "please provide valid image",
        });
      file.mv(`./uploads/${file.name}`, (err) => {
        console.log(err);
      });

      req.imagePath = `/uploads/${file.name}`;

      next();
    } else {
      return res.status(400).json({
        status: "error",
        message: "please provide valid image",
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: "please provide valid image",
    });
  }
};

export const updateFile = (req, res, next) => {
  const file = req.files?.image;
  const oldImagePath = req.body.imagePath;
  try {
    if (file) {
      const val = path.extname(file.name);
      if (!supports.includes(val))
        return res.status(400).json({
          status: "error",
          message: "please provide valid image",
        });
      fs.unlink(`.${oldImagePath}`, (err) => {});
      file.mv(`./uploads/${file.name}`, (err) => {
        console.log(err);
      });

      req.imagePath = `/uploads/${file.name}`;

      next();
    } else {
      next();
    }
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: "please provide valid image",
    });
  }
};
