const express = require("express");
const router = express.Router();
const axios = require("axios");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
router.post("/address", async function (req, res) {
  const {
    id_ad,
    firstName,
    phoneNumber,
    selectedCity,
    selectedDistrict,
    address,
  } = req.body;
  console.log(req.body);
  const user = req.cookies.user ? req.cookies.user.id_kh : null;
  try {
    await axios.post(`http://localhost:3000/api_order/${user}`, {
      id_ad: id_ad,
      firstName: firstName,
      phoneNumber: phoneNumber,
      selectedCity: selectedCity,
      selectedDistrict: selectedDistrict,
      address: address,
    });
    return res.send(firstName);
  } catch (error) {
    console.error("Đã xảy ra lỗi khi gửi dữ liệu tới /api_cart:", error);
  }
});
router.get("/", async function (req, res) {
  const user = req.cookies.user ? req.cookies.user : null;
  console.log("user:", user);
  if (user == null) {
    // Xử lý khi không có user trong cookies
    return res.redirect("/");
  } else {
    const cart = await axios.get(
      `http://localhost:3000/api_order/${user.id_kh}`
    );
    const cartorder = cart.data.data;
    return res.render("order", { cartorder, user });
  }
});
module.exports = router;
