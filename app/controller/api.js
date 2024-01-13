import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/User.js";
import LopHoc from "../model/Class";
import Jobs from "../model/Jobs";
import ClassUser from "../model/ClassUser";

class APIController {
  static async isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static async isAccountValid(role) {
    if (role == "sv") {
      return true;
    }

    if (role == "gv") {
      return true;
    }

    return false;
  }

  static async isLevelValid(level) {
    if (level == "user") {
      return true;
    }

    if (level == "admin") {
      return true;
    }

    return false;
  }

  
  static async ADDClass(req, res) {
    try {

      const {
        id
      } = req.body;

    
      if (id.length == 0) {
        return res.json({
          status: "error",
          message: "ID lớp không được bỏ trống",
        });
      }

      const Check = await LopHoc.findOne({_id:id});

      if (!Check) {
        return res.json({
          status: "error",
          message: "Lớp không tồn tại",
        });
      }

      Check.member = Number(Check.member) + 1;


      const Check2 = await ClassUser.findOne({ClassID:id, UserID:req.user._id});

      if (Check2) {
        return res.json({
          status: "error",
          message: "Bạn đã gia nhập lớp này",
        });
      }

      const classU = new ClassUser({
        UserID:req.user._id,
        ClassID:id,
      });

      if (await classU.save() && await Check.save()) {

        res.json({
          status: "success",
          message: "Gia nhập lớp học thành công",
          redirect:'/account/class'
        });

      } else {
        res.json({
          status: "error",
          message: "Gia nhập lớp học thất bại! Vui lòng thử lại",
        });
      }
    } catch (error) {
      res.json({
        status: "error",
        message: "ID Lớp học không tồn tại",
      });
    }
  }

  static async OutClass(req, res) {
    try {

    
      const id = req.params.id;
      const classu = await ClassUser.findOne({ _id: id , UserID:req.user._id});
  
      if (!classu) {
        res.json({
          status: "error",
          message: "Lớp học không tồn tại",
        });
      }

      const Check = await LopHoc.findOne({_id:classu.ClassID});

      if (!Check) {
        return res.json({
          status: "error",
          message: "Lớp không tồn tại",
        });
      }

      Check.member = Number(Check.member) - 1;

  
      if (await ClassUser.deleteOne({  _id: id , UserID:req.user._id }) && await Check.save()) {

        res.json({
          status: "success",
          message: "Rời lớp học thành công",
          redirect:'/account/class'
        });

      } else {
        res.json({
          status: "error",
          message: "Rời lớp học thất bại! Vui lòng thử lại",
        });
      }
    } catch (error) {
      res.json({
        status: "error",
        message: " Lớp học không tồn tại",
      });
    }
  }

  static async GetLogin(req, res) {
    try {
      const { email, password } = req.body;

      // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
      const user = await User.findOne({ email });

      if (email.length == 0) {
        return res.json({
          status: "error",
          message: "Email không được bỏ trống",
        });
      }

      if (!(await APIController.isEmailValid(email))) {
        return res.json({ status: "error", message: "Email không chính xác" });
      }

      if (!user) {
        return res.json({
          status: "error",
          message: "Người dùng không tồn tại",
        });
      }

      if (password.length == 0) {
        return res.json({
          status: "error",
          message: "Mật khẩu không được bỏ trống",
        });
      }

      // So sánh mật khẩu được nhập với mật khẩu đã được băm trong cơ sở dữ liệu
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.json({
          status: "error",
          message: "Mật khẩu không chính xác",
        });
      }

      // Tạo mã token cho người dùng đã đăng nhập thành công
      const token = jwt.sign({ userID:user._id}, process.env.ACCESS_TOKEN_SECRET);

      // Lưu token vào cookie
      res.cookie("token", token, { httpOnly: true });

      res.json({
        status: "success",
        message: "Đăng nhập thành công",
        redirect: "/",
      });
    } catch (error) {
      console.error("Login error:", error);
      res.json({ status: "error", message: "Lỗi server" });
    }
  }

  static async GetRegister(req, res) {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);

      const {
        fullname,
        email,
        password,
        confirmPassword,
        termsCheckbox,
        role,
      } = req.body;

      const hashedPassword = await bcrypt.hash(password, salt);

      // Check if the user exists in the database
      const user = await User.findOne({ email });

      if (fullname.length == 0) {
        return res.json({
          status: "error",
          message: "Họ và tên không được bỏ trống",
        });
      }

      if (email.length == 0) {
        return res.json({
          status: "error",
          message: "Email không được bỏ trống",
        });
      }

      if (!(await APIController.isEmailValid(email))) {
        return res.json({ status: "error", message: "Email không chính xác" });
      }

      if (user) {
        return res.json({
          status: "error",
          message: "Tài khoản đã tồn tại trong hệ thống",
        });
      }

      if (password.length == 0) {
        return res.json({
          status: "error",
          message: "Mật khẩu không được bỏ trống",
        });
      }

      if (confirmPassword.length == 0) {
        return res.json({
          status: "error",
          message: "Mật khẩu xác nhận không được bỏ trống",
        });
      }

      if (password != confirmPassword) {
        return res.json({
          status: "error",
          message: "Mật khẩu xác nhận không chính xác",
        });
      }

      if (role.length == 0) {
        return res.json({
          status: "error",
          message: "Loại tài khoản không được bỏ trống",
        });
      }

      if (!(await APIController.isAccountValid(role))) {
        return res.json({
          status: "error",
          message: "Loại tài khoản không hợp lệ",
        });
      }

      if (termsCheckbox.length == 0) {
        return res.json({
          status: "error",
          message: "Điều khoản không được bỏ trống",
        });
      }


      const users = new User({
        fullname,
        email,
        password: hashedPassword,
        role: "sv",
        level: "user",
        token: null,
      });

      if (await users.save()) {

        res.json({
          status: "success",
          message: "Tạo tài khoản thành công",
          redirect: "/auth/login",
        });
      } else {
        res.json({
          status: "error",
          message: "Tạo tài khoản thất bại! Vui lòng thử lại",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.json({ status: "error", message: "Server error" });
    }
  }

  static async GetLogout(req, res) {
    try {
      // Xóa cookie chứa token
      res.clearCookie("token");
      res.redirect("/auth/login");
    } catch (error) {
      res.redirect("/auth/login");
    }
  }

  static async UpInfo(req, res) {
    try {
      const { fullname, role } = req.body;

      const users = await User.findOne({ email: req.user.email });

      if (fullname.length == 0) {
        return res.json({
          status: "error",
          message: "Họ và tên không được bỏ trống",
        });
      }

      if (role.length == 0) {
        return res.json({
          status: "error",
          message: "Loại tài khoản không được bỏ trống",
        });
      }

      if (!(await APIController.isAccountValid(role))) {
        return res.json({
          status: "error",
          message: "Loại tài khoản không hợp lệ",
        });
      }

      users.fullname = fullname;
      users.role = role;

      // Save the updated user
      if (await users.save()) {
        res.json({
          status: "success",
          message: "Cập nhật thông tin người dùng thành công",
        });
      } else {
        res.json({
          status: "error",
          message: "Cập nhật thông tin người dùng thất bại",
        });
      }
    } catch (error) {
      res.json({ status: "error", message: "Server error" });
    }
  }

  static async UpPass(req, res) {
    try {
      const { currentPassword, newPassword, confirmNewPassword } = req.body;

      const userId = req.user.id; // Lấy ID của người dùng từ phiên đăng nhập

      if (currentPassword.length == 0) {
        return res.json({
          status: "error",
          message: "Mật khẩu cũ không được bỏ trống",
        });
      }

      if (newPassword.length == 0) {
        return res.json({
          status: "error",
          message: "Mật khẩu mới không được bỏ trống",
        });
      }

      if (confirmNewPassword.length == 0) {
        return res.json({
          status: "error",
          message: "Xác nhận lại mật khẩu mới không được bỏ trống",
        });
      }

      // Kiểm tra mật khẩu hiện tại
      const user = await User.findById(userId);
      if (!user) {
        return res.json({
          status: "error",
          message: "Người dùng không tồn tại",
        });
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        return res.json({
          status: "error",
          message: "Mật khẩu cũ không chính xác",
        });
      }

      // Kiểm tra mật khẩu mới và xác nhận mật khẩu mới
      if (newPassword !== confirmNewPassword) {
        return res.json({
          status: "error",
          message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
        });
      }

      // Cập nhật mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;

      if (await user.save()) {
        res.json({
          status: "success",
          message: "Mật khẩu đã được thay đổi thành công",
        });
      } else {
        res.json({
          status: "error",
          message: "Đổi mật khẩu thất bại",
        });
      }
    } catch (error) {
      res.json({ status: "error", message: "Server error" });
    }
  }

  static async AdminUPUser(req, res) {
    try {
      const id = req.params.id;
      const users = await User.findOne({ _id: id });

      const { fullname, role, level, email } = req.body;

      if (!users) {
        return res.json({
          status: "error",
          message: "Tài khoản không tồn tại",
        });
      }

      if (fullname.length == 0) {
        return res.json({
          status: "error",
          message: "Họ và tên không được bỏ trống",
        });
      }

      if (email.length == 0) {
        return res.json({
          status: "error",
          message: "Email không được bỏ trống",
        });
      }

      if (!(await APIController.isEmailValid(email))) {
        return res.json({ status: "error", message: "Email không chính xác" });
      }

      if (users.email != email) {
        if (await User.findOne({ email: email })) {
          return res.json({
            status: "error",
            message: "Email đã tồn tại",
          });
        }
      }

      if (role.length == 0) {
        return res.json({
          status: "error",
          message: "Loại tài khoản không được bỏ trống",
        });
      }

      if (!(await APIController.isAccountValid(role))) {
        return res.json({
          status: "error",
          message: "Loại tài khoản không hợp lệ",
        });
      }

      if (level.length == 0) {
        return res.json({
          status: "error",
          message: "Cấp bậc không được bỏ trống",
        });
      }

      if (!(await APIController.isLevelValid(level))) {
        return res.json({
          status: "error",
          message: "Cấp bậc không hợp lệ",
        });
      }

      users.fullname = fullname;
      users.email = email;
      users.level = level;
      users.role = role;

      // Save the updated user
      if (await users.save()) {
        res.json({
          status: "success",
          message: "Cập nhật thông tin người dùng thành công",
        });
      } else {
        res.json({
          status: "error",
          message: "Cập nhật thông tin người dùng thất bại",
        });
      }
    } catch (error) {
      res.json({ status: "error", message: "Server error" });
    }
  }

  static async AdminDeleteUser(req, res) {
    const id = req.params.id;
    const users = await User.findOne({ _id: id });

    if (!users) {
       res.json({
        status: "error",
        message: "Tài khoản không tồn tại",
      });
    }

    if (await User.deleteOne({ _id: id })) {
       res.json({
        status: "success",
        message: "Tài khoản đã được xóa thành công",
        redirect: "?ok",
      });
    } else {
      res.json({
        status: "error",
        message: "Xóa tài khoản thất bại",
      });
    }
  }

  static async AdminCreateClass(req, res) {
    try {

      const {
        title
      } = req.body;

    
      if (title.length == 0) {
        return res.json({
          status: "error",
          message: "Tên lớp không được bỏ trống",
        });
      }

      const Lop = new LopHoc({
        title,
        author: req.user.email,
        member: 0,
      });

      if (await Lop.save()) {

        res.json({
          status: "success",
          message: "Tạo lớp học thành công",
        });

      } else {
        res.json({
          status: "error",
          message: "Tạo lớp học thất bại! Vui lòng thử lại",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.json({ status: "error", message: "Server error" });
    }
  }

  static async AdminEditClass(req, res) {
    try {

      const {
        title
      } = req.body;

      const id = req.params.id;
      const Lop = await LopHoc.findOne({ _id: id });

      if (!Lop) {
        res.json({
          status: "error",
          message: "Lớp học không tồn tại",
        });
      }

      if (title.length == 0) {
        return res.json({
          status: "error",
          message: "Tên lớp không được bỏ trống",
        });
      }

       Lop.title = title;

      if (await Lop.save()) {

        res.json({
          status: "success",
          message: "Cập nhập lớp học thành công",
        });

      } else {
        res.json({
          status: "error",
          message: "Cập nhập lớp học thất bại! Vui lòng thử lại",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.json({ status: "error", message: "Server error" });
    }
  }


  static async AdminDeleteClass(req, res) {
   
    const id = req.params.id;
    const Lop = await LopHoc.findOne({ _id: id });

    if (!Lop) {
      res.json({
        status: "error",
        message: "Lớp học không tồn tại",
      });
    }

    if (await LopHoc.deleteOne({ _id: id })) {
       res.json({
        status: "success",
        message: "Tài khoản đã được xóa thành công",
        redirect: "?ok",
      });
    } else {
      res.json({
        status: "error",
        message: "Xóa tài khoản thất bại",
      });
    }
  }

  static async AdminCreateJobs(req, res) {
    try {

      const {
        title,
        link,
        ClassID
      } = req.body;

    
      if (title.length == 0) {
        return res.json({
          status: "error",
          message: "Tên tài liệu không được bỏ trống",
        });
      }

      
      if (link.length == 0) {
        return res.json({
          status: "error",
          message: "Đường dẫn tài liệu không được bỏ trống",
        });
      }
      
      if (ClassID.length == 0) {
        return res.json({
          status: "error",
          message: "Lớp không được bỏ trống",
        });
      }

      const Check = await LopHoc.findOne({_id:ClassID});

      if (!Check) {
        return res.json({
          status: "error",
          message: "Lớp không tồn tại",
        });
      }

      const job = new Jobs({
        title,
        link,
        ClassID,
      });

      if (await job.save()) {

        res.json({
          status: "success",
          message: "Tạo tài liệu thành công",
        });

      } else {
        res.json({
          status: "error",
          message: "Tạo tài liệu thất bại! Vui lòng thử lại",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.json({ status: "error", message: "Server error" });
    }
  }

  static async AdminEditJobs(req, res) {
    try {

      const {
        title,
        link,
        ClassID
      } = req.body;

      const id = req.params.id;
      const jobb = await Jobs.findOne({ _id: id });

      if (!jobb) {
        res.json({
          status: "error",
          message: "Tài liệu không tồn tại",
        });
      }

      if (title.length == 0) {
        return res.json({
          status: "error",
          message: "Tên tài liệu không được bỏ trống",
        });
      }

      
      if (link.length == 0) {
        return res.json({
          status: "error",
          message: "Đường dẫn tài liệu không được bỏ trống",
        });
      }
      
      if (ClassID.length == 0) {
        return res.json({
          status: "error",
          message: "Lớp không được bỏ trống",
        });
      }

      const Check = await LopHoc.findOne({_id:ClassID});

      if (!Check) {
        return res.json({
          status: "error",
          message: "Lớp không tồn tại",
        });
      }

      jobb.title = title;
      jobb.link= link;
      jobb.ClassID= ClassID;

      if (await jobb.save()) {

        res.json({
          status: "success",
          message: "Cập nhập tài liệu thành công",
        });

      } else {
        res.json({
          status: "error",
          message: "Cập nhập tài liệu thất bại! Vui lòng thử lại",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.json({ status: "error", message: "Server error" });
    }
  }

  static async AdminDeleteJobs(req, res) {

    const id = req.params.id;
    const jobb = await Jobs.findOne({ _id: id });

    if (!jobb) {
      res.json({
        status: "error",
        message: "Tài liệu không tồn tại",
      });
    }

    if (await Jobs.deleteOne({ _id: id })) {
       res.json({
        status: "success",
        message: "Tài liệu đã được xóa thành công",
        redirect: "?ok",
      });
    } else {
      res.json({
        status: "error",
        message: "Xóa Tài liệu thất bại",
      });
    }
  }

}

export default APIController;
