const express = require("express");
const router = express.Router();

// GET /about_us - Hiển thị trang About Us
router.get("/", (req, res) => {
  // Nếu bạn có dữ liệu user hay dữ liệu khác muốn truyền vào, thêm vào đối tượng render
  res.render("about_us", {
    title: "About Us - Fashion Hub",
    // Ví dụ: user: req.user, hoặc các dữ liệu khác
  });
});

module.exports = router;
