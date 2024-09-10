/** @format */
import jwt from "jsonwebtoken";

export const userCheck = (req, res, next) => {
  const token = req.headers?.authorization;
  try {
    const decode = jwt.decode(token, "tokey");
    if (decode) {
      const { userId, isAdmin } = decode;
      req.userId = userId;
      req.isAdmin = isAdmin;
      return next();
    } else {
      return res.status(401).json({
        status: "error",
        message: "unauthorised",
      });
    }
  } catch (err) {
    return res.status(401).json({
      status: "error",
      message: "unauthorised",
    });
  }

  next();
};

export const adminCheck = (req, res, next) => {
  if (req.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: "error",
      message: "unauthorised",
    });
  }
};
