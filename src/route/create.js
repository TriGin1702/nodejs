const express = require("express");
const connect = require("../app/control/connect");
const multer = require("multer");
const time = Date.now();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/image");
  },
  filename: (req, file, cb) => {
    cb(null, time + "-" + file.originalname);
  },
});
const upload = multer({ storage });
const router2 = express.Router();
router2.get("/", async (req, res) => {
  try {
    const brand = await new Promise((resolve, reject) => {
      connect.query("SELECT * FROM brand", (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
    res.render("create", { brand: brand });
  } catch (err) {
    console.error(err);
    res.send("error"); // Xử lý lỗi nếu truy vấn không thành công
  }
});
router2.post("/", upload.array("image", 9), async (req, res) => {
  const products = [];

  // Lấy thông tin từ form gửi lên
  const names = req.body.name;
  const descriptions = req.body.description;
  const prices = req.body.gia;
  const brands = req.body.brand;
  const types = req.body.type;
  const images = req.files;

  // Xử lý thông tin và tạo mảng sản phẩm
  for (let i = 0; i < names.length; i++) {
    let anh = time + "-" + images[i].originalname;
    const product = {
      name: names[i],
      description: descriptions[i],
      gia: prices[i],
      brand: brands[i],
      type: types[i],
      image: anh,
    };
    if (product.image == null) {
      product.image = "anhthu.png";
    }
    products.push(product);
  }

  // Lưu mảng sản phẩm vào cơ sở dữ liệu tại đây

  // Ví dụ: Lưu vào cơ sở dữ liệu sử dụng MySQL
  const sql =
    "INSERT INTO product (brands, name, description, type, gia, image) VALUES (?, ?, ?, ?, ?, ?)";
  products.forEach(async (product) => {
    try {
      await connect.query(sql, [
        product.brand,
        product.name,
        product.description,
        product.type,
        product.gia,
        product.image,
      ]);
      console.log("Product inserted:", product);
    } catch (err) {
      console.error("Error inserting product:", err);
    }
  });

  res.redirect("/");
});

module.exports = router2;
