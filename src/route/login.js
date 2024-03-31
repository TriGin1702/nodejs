const express = require("express");
const router1 = express.Router();
const axios = require("axios");
const news = require("./news");
const multer = require("multer"); // Import multer
const register = require("./register");
const cart = require("./cart");
const cookieParser = require("cookie-parser"); // Import cookie-parser

const upload = multer(); // Khởi tạo multer

// Sử dụng cookie-parser middleware để xử lý cookie
router1.use(cookieParser());

router1.use("/cart", cart);
router1.use("/news", news);
router1.use("/register", register);
// Route để hiển thị trang đăng nhập
router1.get("/", async (req, res) => {
  try {
    res.clearCookie("user");
    res.render("login");
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
    const apiResponse = await axios.post("http://localhost:3000/api_acc", {
      accountName: req.body.accountName,
      password: req.body.password,
    });
    const account = apiResponse.data;
    // Nếu đăng nhập thành công, lưu thông tin người dùng vào cookie và chuyển hướng đến trang tin tức
    console.log(account);
    if (account && account.id_kh) {
      const maxAge = 3 * 60 * 60 * 1000;
      res.cookie("user", account, maxAge);
      console.log(req.cookies.user);
      res.redirect("/news");
    } else {
      // Nếu thông tin đăng nhập không chính xác, hiển thị thông báo lỗi
      res.send(
        "<script>alert('Incorrect account or password'); window.location.href = '/';</script>"
      );
    }
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
});

// Sử dụng route /news cho module news

module.exports = router1;
