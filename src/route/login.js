const express = require("express");
const router1 = express.Router();
const axios = require("axios");
const multer = require("multer"); // Import multer
const cookieParser = require("cookie-parser"); // Import cookie-parser

const upload = multer(); // Khởi tạo multer

// Sử dụng cookie-parser middleware để xử lý cookie
router1.use(cookieParser());

// Route để hiển thị trang đăng nhập
router1.get("/", async (req, res) => {
  try {
    res.clearCookie("user");
    return res.render("login");
  } catch (err) {
    console.error(err);
    res.send("error");
  }
});
// Route để xử lý việc đăng nhập
router1.post("/", upload.none(), async (req, res) => {
  // Sử dụng upload.none() để xử lý form không có files
  try {
    // Gửi yêu cầu POST đến API để kiểm tra thông tin đăng nhập
    const apiResponse = await axios.post(
      `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_ACC}`,
      {
        accountName: req.body.accountName,
        password: req.body.password,
      }
    );
    const account = apiResponse.data;
    // Nếu đăng nhập thành công, lưu thông tin người dùng vào cookie và chuyển hướng đến trang tin tức
    console.log(account);
    const maxAge = 3 * 60 * 60 * 1000;
    if (account && account.id_kh) {
      res.cookie("user", account, maxAge);
      // console.log(req.cookies.user);
      return res.redirect("/news");
    } else if (
      req.body.accountName.match("system") &&
      req.body.password.match("master123")
    ) {
      const admin = {
        admin: "system",
        password: "master123",
      };
      res.cookie("admin", admin, maxAge);
      // console.log(req.cookies.admin);
      return res.redirect("/homepage");
    } else {
      // Nếu thông tin đăng nhập không chính xác, hiển thị thông báo lỗi
      return res.send(
        "<script>alert('Incorrect account or password'); window.location.href = '/';</script>"
      );
    }
  } catch (err) {
    console.error(err);
    return res.send("Error");
  }
});

// Sử dụng route /news cho module news

module.exports = router1;
