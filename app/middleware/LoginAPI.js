import jwt from "jsonwebtoken";
import User from "../model/User.js";

const LoginAPI = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findOne({ _id: decoded.userID });
      if (user) {
        return res.json({
          status: "error",
          message: "Bạn đã đăng nhập tài khoản ",
        });
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    next();
  }
};

module.exports = LoginAPI;
