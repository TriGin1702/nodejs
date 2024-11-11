const express = require("express");
const router = express.Router();
const axios = require("axios");
// const cookieParser = require("cookie-parser");
const multer = require("multer");
const upload = multer();
const Handlebars = require("handlebars");
Handlebars.registerHelper("formatDate", function (date) {
  const formattedDate = new Date(date).toLocaleDateString("en-GB");
  return formattedDate;
});
// router.use(cookieParser());
router.post("/quantity", upload.none(), async function (req, res) {
  const user_id = req.session.user ? req.session.user.id_kh : null;
  const { idProduct, quantity } = req.body;
  const token = req.cookies.token;
  console.log(user_id, idProduct, quantity, token);
  try {
    if (quantity > 50) {
      return res.status(400).json({ message: "Số lượng sản phẩm không được vượt quá 50." });
    }
    if (quantity < 1) {
      return res.status(400).json({ message: "Số lượng sản phẩm phải lớn hơn hoặc bằng 1." });
    }
    // Gửi dữ liệu đến địa chỉ /api_cart
    const response = await axios.post(
      `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_CART}/quantity`,
      {
        quantity: quantity,
        checkedProducts: idProduct,
        user_id: user_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
        },
      }
    );
    // Xử lý phản hồi từ server
    // console.log(response); // Log kết quả từ server
    return res.send(response.data); // Trả về kết quả cho client
  } catch (error) {
    console.error("Đã xảy ra lỗi khi gửi dữ liệu tới /api_cart:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error2" });
  }
});
router.get("/delete/:id", upload.none(), async (req, res) => {
  const user = req.session.user ? req.session.user : null;
  const token = req.cookies.token;
  const id = req.params.id;
  if (user == null) {
    // Xử lý khi không có user trong session
    return res.redirect("/");
  } else {
    await axios.delete(`${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_CART}/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
      },
    });
    return res.redirect("/cart");
  }
});
router.get("/", upload.none(), async function (req, res) {
  const user = req.session.user ? req.session.user : null;
  const token = req.cookies.token;
  console.log("token: " + token);
  if (user == null) {
    // Xử lý khi không có user trong session
    return res.redirect("/");
  } else {
    const cart = await axios.get(`${process.env.DOMAIN}:${process.env.PORT}/api_cart/${user.id_kh}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
      },
    });
    const cartdetail = cart.data.data;
    return res.render("cart", { cartdetail, user });
  }
});
router.post("/", upload.none(), async (req, res) => {
  const user_id = req.session.user ? req.session.user.id_kh : null;
  const { idProduct } = req.body;
  const token = req.cookies.token;
  console.log(idProduct, "token123", token);
  try {
    // Gửi dữ liệu đến địa chỉ /api_cart
    const response = await axios.post(
      `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_CART}/${user_id}`,
      {
        idProduct: idProduct,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
        },
      }
    );

    // Xử lý phản hồi từ server
    return res.send(response.data); // Trả về kết quả cho client
  } catch (error) {
    console.error("Đã xảy ra lỗi khi gửi dữ liệu tới /api_cart:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error2" });
  }
});
router.post("/address", upload.none(), async (req, res) => {
  const { name, phoneNumber, city, district, address, checkedProducts } = req.body;
  const user_id = req.session.user ? req.session.user.id_kh : null;
  const token = req.cookies.token;
  try {
    // Gửi dữ liệu đến địa chỉ /api_cart
    const response = await axios.post(
      `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_CART}/address`,
      {
        user_id: user_id,
        name: name,
        phoneNumber: phoneNumber,
        city: city,
        district: district,
        address: address,
        checkedProducts: checkedProducts,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
        },
      }
    );
    // Xử lý phản hồi từ server
    return res.send(response.data); // Trả về kết quả cho client
    // res.redirect("/cart");
  } catch (error) {
    console.error("Đã xảy ra lỗi khi gửi dữ liệu tới /api_cart:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error2" });
  }
});
module.exports = router;
