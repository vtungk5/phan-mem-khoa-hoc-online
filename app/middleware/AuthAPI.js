import jwt from "jsonwebtoken";
import User from "../model/User.js";

const AuthAPI = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findOne({ _id: decoded.userID });
      if (user) {
        req.user = user;
        next();
      } else {
        return res.json({
          status: "error",
          message: "Người dùng không tồn tại",
        });
      }
    } else {
      return res.json({
        status: "error",
        message: "Người dùng không tồn tại",
      });
    }
  } catch (error) {
    return res.json({
      status: "error",
      message: "Người dùng không tồn tại",
    });
  }
};

module.exports = AuthAPI;
