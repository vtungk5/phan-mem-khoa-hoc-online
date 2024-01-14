import jwt from "jsonwebtoken";
import User from "../model/User.js";

const Login = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findOne({ _id: decoded.userID });
      if (user) {
        res.redirect("/");
      }else{
        next();
      }
    }else{
      next();
    }
  } catch (error) {
    next();
  }
};

module.exports = Login;
