const express = require("express");
const router1 = express.Router();
const axios = require("axios");
const multer = require("multer"); // Import multer

const upload = multer(); // Khởi tạo multer

// Route để hiển thị trang đăng nhập
router1.get("/", async (req, res) => {
  try {
    // Trả về trang đăng nhập mà không cần xóa cookie hay session
    return res.render("login");
  } catch (err) {
    console.error(err);
    return res.send("error");
  }
});

// Route để xử lý việc đăng nhập
router1.post("/", upload.none(), async (req, res) => {
  // Sử dụng upload.none() để xử lý form không có files
  try {
    // Nếu đăng nhập thành công
    // if (req.body.accountName.match("system") && req.body.password.match("master123")) {
    //   // Chuyển hướng đến trang homepage
    //   return res.redirect("/homepage");
    // }
    const apiResponse = await axios.post(`${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_ACC}`, {
      accountName: req.body.accountName,
      password: req.body.password,
    });
    const account = apiResponse.data;
    if (account) {
      res.cookie("userId", account.id, { maxAge: 3 * 60 * 60 * 1000 }); // Lưu ID người dùng vào cookie
    }
    if (account.role_name.match("user")) {
      // Chuyển hướng đến trang tin tức
      req.session.user = account; // Lưu toàn bộ thông tin người dùng vào session
      return res.redirect("/news");
    } else if (account.role_name.match("admin")) {
      req.session.admin = account;
      return res.redirect("/homepage");
    } else {
      // Nếu thông tin đăng nhập không chính xác, hiển thị thông báo lỗi
      return res.send("<script>alert('Incorrect account or password'); window.location.href = '/';</script>");
    }
  } catch (err) {
    console.error(err);
    return res.send("Error");
  }
});

// Xuất module router
module.exports = router1;
