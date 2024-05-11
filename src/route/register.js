const express = require("express");
const router1 = express.Router();
const axios = require("axios");

// Route để hiển thị trang đăng nhập
router1.get("/", (req, res) => {
  // Render trang đăng ký ở đây
  return res.render("register");
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
      console.log(response.data);
      // Xử lý phản hồi từ máy chủ API
      return res.status(200).redirect("/");
    })
    .catch((error) => {
      if (error.response && error.response.status === 400) {
        // Nếu API trả về mã lỗi 400, gửi lại mã lỗi 400 và phản hồi từ máy chủ API cho máy khách
        return res
          .status(400)
          .send(
            '<script>alert("' +
              error.response.data +
              '"); window.location.href = window.location.href;</script>'
          );
      } else {
        console.error(error);
        return res.status(500).send("Error");
      }
    });
});

// Sử dụng route /news cho module news

module.exports = router1;
