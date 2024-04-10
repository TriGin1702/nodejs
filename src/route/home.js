const express = require("express");
const connect = require("../app/control/connect");
const fs = require("fs");
const imageFolderPath = "D:/studyonweb/json_server/src/public/image/";
const route = express.Router();
const create = require("./create");
const multer = require("multer");
const { error } = require("console");
const time = Date.now();
const axios = require("axios");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const { router } = require("json-server");
route.use(cookieParser());
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
      res.redirect("/");
    }
    const listusers = await axios.get(
      "http://localhost:3000/api_acc/list_users"
    );
    const users = listusers.data;
    console.log(users);
    res.render("list_user", { users: users });
  } catch (err) {
    res.send(err);
  }
});
route.get("/", async (req, res) => {
  try {
    const admin = req.cookies.admin || null;
    if (admin == null) {
      res.redirect("/");
    }
    await connect.query("select * from product", (err, result) => {
      product = result;
      // req.app.locals.product = product;
      req.app.locals.customername = "Login";
      res.render("home", { product: product });
    });
  } catch (err) {
    res.send(err);
  }
});
route.get("/update/:id", async (req, res) => {
  const admin = req.cookies.admin || null;
  if (admin == null) {
    res.redirect("/");
  }
  const inputString = req.params.id;
  const splittedStrings = inputString.split("-");
  const firstPart = splittedStrings[0];
  try {
    const product = await new Promise(async (resolve, reject) => {
      await connect.query(
        "select * from product where id_product = ?",
        [firstPart],
        (err, result) => {
          resolve(result);
        }
      );
    });
    const brand = await new Promise(async (resolve, reject) => {
      await connect.query("select brand_id from brand", (err, result) => {
        resolve(result);
      });
    });
    // res.send({product});
    res.render("update", { product: product[0], brand: brand });
  } catch (err) {
    res.send(err);
  }
});
route.post("/update/:id", upload.single("image"), async (req, res) => {
  const admin = req.cookies.admin || null;
  if (admin == null) {
    res.redirect("/");
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
    let dongbo = "";
    if (image.match(ImageFileName)) {
      dongbo = image;
    } else {
      dongbo = time + "-" + image;
    }

    fs.readdir(imageFolderPath, (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        if (file === ImageFileName) {
          fs.unlinkSync(imageFolderPath + file);
          console.log(`${file} has been deleted.`);
        }
      });
    });
    // Câu lệnh UPDATE đầu tiên
    await connect.query(
      "UPDATE product SET brands=?, name=?, description=?, type=?, gia=?, image=? WHERE id_product = ?",
      [brand, name, description, type, gia, dongbo, idProduct]
    );

    res.redirect("/homepage");
  } catch (err) {
    // Xử lý lỗi nếu có
    console.error("Lỗi trong quá trình thực hiện câu lệnh UPDATE:", err);
    res.status(500).send("Đã xảy ra lỗi trong quá trình cập nhật dữ liệu.");
  }
});
route.get("/delete/:id", upload.none(), async (req, res) => {
  const admin = req.cookies.admin || null;
  if (admin == null) {
    res.redirect("/");
  }
  const inputString = req.params.id;
  const splittedStrings = inputString.split("-");
  // Lấy hai chuỗi đã tách ra
  const firstPart = splittedStrings[0];
  const ImageFileName = splittedStrings[1] + "-" + splittedStrings[2];
  const response = await axios.delete(`http://localhost:3000/api/${firstPart}`);
  console.log(firstPart);
  // Kiểm tra xem có lỗi khi gửi yêu cầu không
  if (response.status !== 200) {
    throw new Error("Failed to delete product");
  }
  fs.readdir(imageFolderPath, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file === ImageFileName) {
        fs.unlinkSync(imageFolderPath + file);
        console.log(`${file} has been deleted.`);
      }
    });
  });
  res.redirect("/homepage");
});
route.post("/home", upload.single("image"), (req, res) => {
  const sql =
    "INSERT INTO product (brands, name, description, type, gia, image) VALUES (?, ?, ?, ?, ?, ?)";
  const { brand, name, description, type, gia } = req.body;
  let dongbo;
  if (req.file) {
    dongbo = time + "-" + req.file.originalname;
  } else {
    dongbo = "anhthu.png";
  }
  connect.query(
    sql,
    [brand, name, description, type, gia, dongbo],
    (err, result) => {
      if (err) {
        console.error("Error saving product:", err);
      } else {
        console.log("Product saved:", result);
      }
    }
  );
  res.send(req.body);
});
route.use("/create", create);
module.exports = route;
