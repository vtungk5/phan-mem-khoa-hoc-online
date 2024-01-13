import jwt from "jsonwebtoken";
import User from "../model/User.js";

const Authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findOne({ userID: decoded._id });
      if (user) {
        req.user = user;
        next();
      }else{
        res.redirect("/auth/login");
      }
    }else{
      res.redirect("/auth/login");
    }

  } catch (error) {
    res.redirect("/auth/login");
  }
};

module.exports = Authenticate;
