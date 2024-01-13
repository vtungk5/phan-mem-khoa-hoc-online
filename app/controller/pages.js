import moment from "moment";
import LopHoc from "../model/Class";
import Jobs from "../model/Jobs";
import ClassUser from "../model/ClassUser";

class HomeController {
  static async GetBody() {
    return "has-navbar-vertical-aside navbar-vertical-aside-show-xl footer-offset";
  }

  static async AuthBody() {
    return "d-flex align-items-center min-h-100";
  }

  static async GetHome(req, res) {
    const ClassUs = await ClassUser.find({ UserID: req.user._id });
    const list = await Promise.all(
      ClassUs.map(async (data) => {
        const classData = await LopHoc.findOne({ _id: data.ClassID });
        return {
          _id: classData._id,
          title: classData.title,
          author: classData.author,
          member: classData.member,
          createdAt: moment(classData.createdAt).format(
            "DD/MM/YYYY - HH:mm:ss"
          ),
          outID: data._id,
        };
      })
    );
    return res.render("index", {
      bodyClass: await HomeController.GetBody(),
      list,
      user: req.user,
    });
  }

  static async STAccount(req, res) {
    return res.render("account/setting", {
      bodyClass: await HomeController.GetBody(),
      user: req.user,
    });
  }

  static async GetLogin(req, res) {
    return res.render("auth/login", {
      bodyClass: await HomeController.AuthBody(),
    });
  }

  static async GetRegister(req, res) {
    return res.render("auth/register", {
      bodyClass: await HomeController.AuthBody(),
    });
  }

  static async AddClass(req, res) {
    return res.render("class/add", {
      bodyClass: await HomeController.GetBody(),
      user: req.user,
    });
  }

  static async MyClass(req, res) {
    const ClassUs = await ClassUser.find({ UserID: req.user._id });
    const list = await Promise.all(
      ClassUs.map(async (data) => {
        const classData = await LopHoc.findOne({ _id: data.ClassID });
        return {
          _id: classData._id,
          title: classData.title,
          author: classData.author,
          member: classData.member,
          createdAt: moment(classData.createdAt).format(
            "DD/MM/YYYY - HH:mm:ss"
          ),
          outID: data._id,
        };
      })
    );
    return res.render("class/index", {
      bodyClass: await HomeController.GetBody(),
      list,
      user: req.user,
    });
  }

  static async ListJobs(req, res) {
    const ClassUs = await ClassUser.find({ UserID: req.user._id });
    const list = await Promise.all(
      ClassUs.map(async (data) => {
        const classData = await LopHoc.findOne({ _id: data.ClassID });
        if (classData) {
            const job = await Jobs.findOne({ ClassID: data.ClassID });
          return {
            _id: job._id,
            title: job.title,
            link: job.link,
            class: classData,
            createdAt: moment(job.createdAt).format("DD/MM/YYYY - HH:mm:ss"),
          };
        } else {
          return classData;
        }
      })
    );
    return res.render("job/index", {
      bodyClass: await HomeController.GetBody(),
      list,
      user: req.user,
    });
  }
}

export default HomeController;
