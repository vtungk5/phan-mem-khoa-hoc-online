import moment from "moment";
import User from "../model/User";
import LopHoc from "../model/Class";
import Jobs from "../model/Jobs";

class AdminController {
  static async GetBody() {
    return "has-navbar-vertical-aside navbar-vertical-aside-show-xl footer-offset";
  }

  static async AuthBody() {
    return "d-flex align-items-center min-h-100";
  }

  static async TypeAccount($data) {
    if ($data == "sv") {
      return "Học sinh";
    } else if ($data == "gv") {
      return "Giáo viên";
    } else {
      return "Quản trị viên";
    }
  }
  
  static async CreateJobs(req, res) {
    const Lop = await LopHoc.find();

    return res.render("admin/jobs/create", {
      bodyClass: await AdminController.GetBody(),
      user: req.user,
      list:Lop
    });
  }

  static async ListJobs(req, res) {
   
    const job = await Jobs.find();
    
    const list = await Promise.all(job.map(async (data) => {
      const classData = await LopHoc.findOne({ _id: data.ClassID });
      return {
        _id:data._id,
        title:data.title,
        link:data.link,
        class:(classData) ? classData.title : 'lớp học không tồn tại',
        createdAt: moment(data.createdAt).format("DD/MM/YYYY - HH:mm:ss"),

      };
    }));
    return res.render("admin/jobs/index", {
      bodyClass: await AdminController.GetBody(),
      user: req.user,
      list:list
    });
  }
  static async EditJobs(req, res) {
    try {
      
      const id = req.params.id;
      const job = await Jobs.findOne({ _id: id });
      const Lop = await LopHoc.find();

      if (!job) {
        res.redirect("/");
      }

      return res.render("admin/jobs/edit", {
        bodyClass: await AdminController.GetBody(),
        user: req.user,
        data: job,
        list:Lop
      });
      
    } catch (error) {
      res.redirect("/");
    }
  }
  static async CreateClass(req, res) {
   
    return res.render("admin/class/create", {
      bodyClass: await AdminController.GetBody(),
      user: req.user,
    });
  }
  static async EditClass(req, res) {
    try {
      
      const id = req.params.id;
      const Lop = await LopHoc.findOne({ _id: id });

      if (!Lop) {
        res.redirect("/");
      }

      return res.render("admin/class/edit", {
        bodyClass: await AdminController.GetBody(),
        user: req.user,
        data: Lop,
      });
      
    } catch (error) {
      res.redirect("/");
    }
  }
  static async ListClass(req, res) {
    const Lop = await LopHoc.find();

    const list = Lop.map((data) => ({
      _id: data._id,
      title: data.title,
      author: data.author,
      member: data.member,
      createdAt: moment(data.createdAt).format("DD/MM/YYYY - HH:mm:ss"),
    }));

    return res.render("admin/class/index", {
      bodyClass: await AdminController.GetBody(),
      user: req.user,
      list: list,
    });
  }


  static async ListStudent(req, res) {
    const users = await User.find();

    const list = users.map((data) => ({
      _id: data._id,
      fullname: data.fullname,
      email: data.email,
      role: data.role,
      createdAt: moment(data.createdAt).format("DD/MM/YYYY - HH:mm:ss"),
    }));

    return res.render("admin/users/student", {
      bodyClass: await AdminController.GetBody(),
      user: req.user,
      list: list,
    });
  }

  static async ListTeacher(req, res) {
    const users = await User.find();

    const list = users.map((data) => ({
      _id: data._id,
      fullname: data.fullname,
      email: data.email,
      role: data.role,
      createdAt: moment(data.createdAt).format("DD/MM/YYYY - HH:mm:ss"),
    }));

    return res.render("admin/users/teacher", {
      bodyClass: await AdminController.GetBody(),
      user: req.user,
      list: list,
    });
  }

  static async EditUser(req, res) {
    try {
      
      const id = req.params.id;
      const users = await User.findOne({ _id: id });

      if (!users) {
        res.redirect("/");
      }

      return res.render("admin/users/edit", {
        bodyClass: await AdminController.GetBody(),
        user: req.user,
        users: users,
      });
      
    } catch (error) {
      res.redirect("/");
    }
  }
}

export default AdminController;
