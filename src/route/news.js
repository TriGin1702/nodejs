const express = require("express");
const router1 = express.Router();
const axios = require("axios");
const cookieParser = require("cookie-parser");
const session = require("express-session");
router1.use(cookieParser());
router1.use(
  session({
    secret: "hi", // Chuỗi bí mật để mã hóa session
    resave: false,
    saveUninitialized: true,
  })
);
router1.get("/", async (req, res) => {
  try {
    // Lấy giá trị của tham số "sort" từ query string
    const sortValue = req.query.sort || "default"; // Giá trị mặc định nếu không có query string
    console.log(req.query.search);
    // Gửi yêu cầu tới API với tham số "sort"
    let apiURL = "http://localhost:3000/api?";
    if (req.query.search) {
      apiURL += `search=${req.query.search}&`;
    }
    apiURL += `sort=${sortValue}`;

    const apiResponse = await axios.get(apiURL);
    const product = apiResponse.data;
    // const localproduct =
    // Lấy dữ liệu từ cookie
    const user = req.cookies.user || null;
    if (user === null) {
      return res.redirect("/");
    }
    const totalProducts = await axios.get(
      `http://localhost:3000/api/quantity_product/${user.id_kh}`
    );
    const nummberproducts = totalProducts.data.totalQuantity;
    console.log(nummberproducts);
    return res.render("news", { product, user, nummberproducts });
  } catch (err) {
    console.error(err);
    return res.send("error");
  }
});

// router1.post("/", async (req, res) => {
//   try {
//     // Lấy dữ liệu từ form POST
//     const searchValue = req.body.search;

//     // req.app.locals.search = searchValue;
//     req.session.searchValue = searchValue;

//     // Truyền dữ liệu product vào view
//     return res.redirect("/news");
//   } catch (err) {
//     console.error(err);
//     return res.send("error");
//   }
// });
router1.get("/:id", async (req, res) => {
  const inputproudct = req.params.id.split("-");
  const brand = inputproudct[0];
  console.log(brand);
  const name = inputproudct[1];
  console.log(name);
  const user = req.cookies.user || null;
  if (user === null) {
    return res.redirect("/");
  }
  try {
    const listproducts = await axios.get("http://localhost:3000/api");
    const products = listproducts.data;
    console.log(typeof products);
    console.log(Array.isArray(products));
    const product = products.find(
      (item) => item.brands === brand && item.name === name
    );
    if (product) {
      console.log(product);
    } else {
      console.log("Không tìm thấy sản phẩm.");
    }
    return res.render("product", { product: product, user: user });
  } catch (err) {
    console.error(err);
    return res.send("error");
  }
});
// router1.post("/cart", async (req, res) => {
//   const { brand, name } = req.body;
//   // console.log(req.body);
//   const user_id = req.cookies.user.id_kh;
//   console.log(user_id, brand, name);
//   await axios.post("http://localhost:3000/api_cart", {
//     brand: brand,
//     name: name,
//     user_id: user_id,
//   });
// });
module.exports = router1;
