const express = require("express");
const router1 = express.Router();
const axios = require("axios");

// Route để hiển thị trang đăng nhập
router1.get("/", (req, res) => {
  // Render trang đăng ký ở đây
  res.render("register");
});
router1.post("/", (req, res) => {
  const customer = {
    name: req.body.Name,
    gender: req.body.gender,
    age: req.body.Age,
    accountName: req.body.accountName, // Đã sửa thành accountName để khớp với tên trường trong API
    password: req.body.password,
  };

  // Gửi dữ liệu của khách hàng đến API để chèn vào cơ sở dữ liệu
  axios
    .post("http://localhost:3000/api_acc/register", customer)
    .then((response) => {
      console.log(response.data); // Log dữ liệu phản hồi từ API

      // Hiển thị thông báo thành công

      // Chuyển hướng người dùng đến trang khác hoặc làm bất kỳ hành động nào khác tùy thuộc vào yêu cầu của bạn
      // res.redirect("/");

      res
        .status(200)
        .send(
          "<script>alert('Registration successful!'); window.location.href = '/';</script>"
        ); // Phản hồi về cho người dùng
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error"); // Xử lý lỗi nếu gặp lỗi khi gửi yêu cầu
    });
});

// Sử dụng route /news cho module news

module.exports = router1;
