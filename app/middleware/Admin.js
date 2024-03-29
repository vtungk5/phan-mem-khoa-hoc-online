import jwt from "jsonwebtoken";
import User from "../model/User.js";

const AdminAPI = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findOne({ _id: decoded.userID });
      if (user) {
        if (user.level == "admin") {
          req.user = user;
          next();
        } else {
          res.redirect("/");
        }
      } else {
        res.redirect("/auth/login");
      }
    } else {
      res.redirect("/auth/login");
    }
  } catch (error) {
    res.redirect("/auth/login");
  }
};

module.exports = AdminAPI;
