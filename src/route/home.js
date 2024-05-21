const express = require("express");
const connect = require("../app/control/connect");
const fs = require("fs");
const path = require("path");
const imageFolderPath = path.join(__dirname, "../public/image/");
const route = express.Router();
const multer = require("multer");
const { error } = require("console");
const time = Date.now();
const axios = require("axios");
const cookieParser = require("cookie-parser"); // Import cookie-parser
route.use(cookieParser());
require("dotenv").config();
var product = [];
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/image");
  },
  filename: (req, file, cb) => {
    cb(null, time + "-" + file.originalname);
  },
});
const upload = multer({ storage });
route.get("/list_users", async (req, res) => {
  try {
    const admin = req.cookies.admin || null;
    if (admin == null) {
      return res.redirect("/");
    }
    const url = `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_ACC}/list_users`;
    console.log("Fetching users from URL:", url);

    const listusers = await axios.get(url);
    const users = listusers.data;
    console.log(users);
    return res.render("list_user", { users: users });
  } catch (err) {
    return res.send(err);
  }
});
route.post("/home", upload.single("image"), async (req, res) => {
  const sql =
    "INSERT INTO product (brands, name, description, type, gia, image) VALUES (?, ?, ?, ?, ?, ?)";
  const { brand, name, description, type, gia } = req.body;
  let dongbo;
  if (req.file) {
    dongbo = time + "-" + req.file.originalname;
  } else {
    dongbo = "anhthu.png";
  }
  await new Promise((resolve, reject) => {
    connect.query(
      sql,
      [brand, name, description, type, gia, dongbo],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
});
route.get("/update/:id", async (req, res) => {
  const admin = req.cookies.admin || null;
  if (admin == null) {
    return res.redirect("/");
  }
  const inputString = req.params.id;
  const splittedStrings = inputString.split("-");
  const firstPart = splittedStrings[0];
  try {
    const product = await new Promise((resolve, reject) => {
      connect.query(
        "select * from product where id_product = ?",
        [firstPart],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
    const brand = await new Promise((resolve, reject) => {
      connect.query("select brand_id from brand", (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
    // res.send({product});
    return res.render("update", { product: product[0], brand: brand });
  } catch (err) {
    return res.send(err);
  }
});
route.post("/update/:id", upload.single("image"), async (req, res) => {
  const admin = req.cookies.admin || null;
  if (admin == null) {
    return res.redirect("/");
  }
  const inputString = req.params.id;
  const splittedStrings = inputString.split("-");
  // Lấy phần id_product từ mảng splittedStrings
  const idProduct = splittedStrings[0];
  console.log(idProduct); // In ra id_product để kiểm tra xem nó đã đúng chưa

  // Tiếp tục lấy các phần tử khác nếu cần
  const date = splittedStrings[1];
  const imagename = splittedStrings[2];
  const ImageFileName = date + "-" + imagename;
  const { brand, name, description, type, gia } = req.body;
  const image = req.file ? req.file.originalname : ImageFileName;
  try {
    let dongbo = ImageFileName;
    if (!image.match(ImageFileName)) {
      dongbo = time + "-" + image;
      fs.readdir(imageFolderPath, (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
          if (file === ImageFileName) {
            fs.unlinkSync(imageFolderPath + file);
            console.log(`${file} has been deleted.`);
          }
        });
      });
    }
    // Câu lệnh UPDATE đầu tiên
    await new Promise((resolve, reject) => {
      connect.query(
        "UPDATE product SET brands=?, name=?, description=?, type=?, gia=?, image=? WHERE id_product = ?",
        [brand, name, description, type, gia, dongbo, idProduct],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    return res.redirect("/homepage");
  } catch (err) {
    // Xử lý lỗi nếu có
    console.error("Lỗi trong quá trình thực hiện câu lệnh UPDATE:", err);
    return res
      .status(500)
      .send("Đã xảy ra lỗi trong quá trình cập nhật dữ liệu.");
  }
});
route.get("/delete/:id", upload.none(), async (req, res) => {
  const admin = req.cookies.admin || null;
  if (admin == null) {
    return res.redirect("/");
  }
  const inputString = req.params.id;
  const splittedStrings = inputString.split("-");
  // Lấy hai chuỗi đã tách ra
  const firstPart = splittedStrings[0];
  const ImageFileName = splittedStrings[1] + "-" + splittedStrings[2];
  try {
    await axios.delete(
      `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_PRODUCT}/${firstPart}`
    );

    fs.readdir(imageFolderPath, (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        if (file === ImageFileName) {
          fs.unlinkSync(imageFolderPath + file);
          console.log(`${file} has been deleted.`);
        }
      });
    });

    return res.redirect("/homepage");
  } catch (err) {
    return res.send(err);
  }
});
// route.use("/create", create);
route.get("/", async (req, res) => {
  try {
    const admin = req.cookies.admin || null;
    if (admin == null) {
      return res.redirect("/");
    }
    await new Promise((resolve, reject) => {
      connect.query("select * from product", (err, result) => {
        if (err) reject(err);
        product = result;
        resolve();
      });
    });
    // req.app.locals.product = product;
    return res.render("home", { product: product });
  } catch (err) {
    return res.send(err);
  }
});

module.exports = route;
