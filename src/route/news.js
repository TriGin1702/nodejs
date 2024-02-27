const express = require("express");
const router1 = express.Router();
const { exec } = require("child_process");
const connect = require("../app/control/connect");
const axios = require("axios");
// Biên dịch Sass khi khởi động ứng dụng
// router1.get("/", async (req, res) => {
//   try {
//     exec(
//       "npx node-sass src/resource/scss/app.scss --output src/public/css/app.css",
//       (err, stdout, stderr) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         console.log(stdout);
//       }
//     );
//     await connect.query("SELECT * FROM product", (err, rows) => {
//       if (err) throw err;
//       const product = rows; // Lưu trữ dữ liệu vào một biến
//       res.render("news", { product: product }); // Truyền dữ liệu product vào view
//     });
//   } catch (err) {
//     console.error(err);
//     res.send("error"); // Xử lý lỗi nếu truy vấn không thành công
//   }
// });
router1.get("/", async (req, res) => {
  try {
    exec(
      "npx node-sass src/resource/scss/app.scss --output src/public/css/app.css",
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
      }
    );
    // Lấy dữ liệu từ API
    const apiResponse = await axios.get("http://localhost:3000/api");
    const product = apiResponse.data;
    // console.log(product);
    // Truyền dữ liệu product vào view
    res.render("news", { product: product });
  } catch (err) {
    console.error(err);
    res.send("error");
  }
});
router1.get("/:id", async (req, res) => {
  const inputproudct = req.params.id.split("-");
  const brand = inputproudct[0];
  console.log(brand);
  const name = inputproudct[1];
  console.log(name);
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
    res.render("product", { product: product });
  } catch (err) {
    console.error(err);
    res.send("error");
  }
});
module.exports = router1;
