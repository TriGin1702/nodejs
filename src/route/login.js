const express = require("express");
const router1 = express.Router();
const axios = require("axios");
const multer = require("multer"); // Import multer
const jwt = require("jsonwebtoken");
const upload = multer(); // Khởi tạo multer

// Route để hiển thị trang đăng nhập
router1.get("/", async (req, res) => {
  try {
    // Xóa session
    req.session.destroy((err) => {
      if (err) {
        console.error("Không thể xóa session:", err);
      }
    });

    // Xóa cookie "token"
    res.clearCookie("token");
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
    if (!(account === "Account not found")) {
      // Tạo JWT
      console.log("Account: " + account);
      const token = jwt.sign(
        {
          id: account.id,
          role: account.role_name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3h" } // Token hết hạn sau 3 giờ
      );

      // Gửi token dưới dạng cookie tới client
      res.cookie("token", token, { maxAge: 3 * 60 * 60 * 1000, httpOnly: true });

      // Chuyển hướng người dùng dựa trên vai trò
      if (account.role_name === "user") {
        req.session.user = account;
        return res.redirect("/news");
      } else if (account.role_name !== "user") {
        req.session.admin = account;
        return res.redirect("/homepage");
      }
    } else {
      return res.send("<script>alert('Incorrect account or password'); window.location.href = '/';</script>");
    }
  } catch (err) {
    console.error(err);
    return res.send("Error");
  }
});

// Xuất module router
module.exports = router1;
