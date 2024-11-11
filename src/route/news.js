const express = require("express");
const router1 = express.Router();
const axios = require("axios");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");
// router1.use(cookieParser());
router1.get("/", async (req, res) => {
  try {
    // Lấy giá trị của tham số "sort" từ query string
    const sortValue = req.query.sort || "default"; // Giá trị mặc định nếu không có query string
    console.log(req.query.search);
    // Gửi yêu cầu tới API với tham số "sort"
    let apiURL = `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_PRODUCT}?`;
    if (req.query.search) {
      apiURL += `search=${req.query.search}&`;
    }
    apiURL += `sort=${sortValue}`;
    const token = req.cookies.token;
    const apiResponse = await axios.get(apiURL, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
      },
    });
    const product = apiResponse.data;
    // const localproduct =
    // Lấy dữ liệu từ cookie
    const user = req.session.user || null;
    // console.log(user);
    if (user === null) {
      return res.redirect("/");
    }
    const totalProducts = await axios.get(`${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_PRODUCT}/quantity_product/${user.id_kh}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
      },
    });
    const nummberproducts = totalProducts.data.totalQuantity;
    console.log(nummberproducts);
    return res.render("news", { product, user, nummberproducts });
  } catch (err) {
    console.error(err);
    return res.send("error");
  }
});
module.exports = router1;
