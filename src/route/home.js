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
const { router } = require("json-server");
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
route.get("/", async (req, res) => {
  try {
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
  const inputString = req.params.id;
  const splittedStrings = inputString.split("-");

  // Lấy hai chuỗi đã tách ra
  const firstPart = splittedStrings[0]; // "anpha"
  const secondPart = splittedStrings[1];
  try {
    const product = await new Promise(async (resolve, reject) => {
      await connect.query(
        "select * from product where brands = ? and name =?",
        [firstPart, secondPart],
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
// route.get("/update", async (req, res) => {
//   const inputString = req.query.id;
//   const splittedStrings = inputString.split("-");

//   // Lấy hai chuỗi đã tách ra
//   const firstPart = splittedStrings[0]; // "anpha"
//   const secondPart = splittedStrings[1];
//   try {
//     const product = await new Promise(async (resolve, reject) => {
//       await connect.query(
//         "select * from product where brands = ? and name =?",
//         [firstPart, secondPart],
//         (err, result) => {
//           resolve(result);
//         }
//       );
//     });
//     const brand = await new Promise(async (resolve, reject) => {
//       await connect.query("select brand_id from brand", (err, result) => {
//         resolve(result);
//       });
//     });
//     // res.send({product});
//     res.render("update", { product: product[0], brand: brand });
//   } catch (err) {
//     res.send(err);
//   }
// });
route.post("/update/:id", upload.single("image"), async (req, res) => {
  const inputString = req.params.id;
  const splittedStrings = inputString.split("-");

  // Lấy hai chuỗi đã tách ra
  const firstPart = splittedStrings[0]; // "anpha"
  const secondPart = splittedStrings[1];
  const date = splittedStrings[2];
  const imagename = splittedStrings[3];
  const ImageFileName = date + "-" + imagename;
  const { brand, name, description, type, gia } = req.body;
  const image = req.file ? req.file.originalname : ImageFileName;
  if (image === ImageFileName) {
    try {
      // Câu lệnh UPDATE đầu tiên
      const updateResult1 = await connect.query(
        "UPDATE product SET brands=?, description=?, type=?, gia=? WHERE name = ?",
        [brand, description, type, gia, secondPart]
      );

      // Kiểm tra kết quả câu lệnh UPDATE đầu tiên
      if (updateResult1.affectedRows === 0) {
        // Không tìm thấy bản ghi nào phù hợp với điều kiện WHERE
        throw new Error(
          "Không tìm thấy bản ghi phù hợp trong câu lệnh UPDATE đầu tiên."
        );
      }

      // Câu lệnh UPDATE thứ hai
      const updateResult2 = await connect.query(
        "UPDATE product SET name=? WHERE brands = ?",
        [name, firstPart]
      );

      // Kiểm tra kết quả câu lệnh UPDATE thứ hai
      if (updateResult2.affectedRows === 0) {
        // Không tìm thấy bản ghi nào phù hợp với điều kiện WHERE
        throw new Error(
          "Không tìm thấy bản ghi phù hợp trong câu lệnh UPDATE thứ hai."
        );
      }

      // Đã thực hiện thành công cả hai câu lệnh UPDATE
      res.redirect("/homepage");
    } catch (err) {
      // Xử lý lỗi nếu có
      console.error("Lỗi trong quá trình thực hiện câu lệnh UPDATE:", err);
      res.status(500).send("Đã xảy ra lỗi trong quá trình cập nhật dữ liệu.");
    }
  } else {
    const dongbo = time + "-" + image;
    try {
      // Câu lệnh UPDATE đầu tiên
      const updateResult1 = await connect.query(
        "UPDATE product SET brands=?, description=?, type=?, gia=?, image=? where name =?",
        [brand, description, type, gia, dongbo, secondPart]
      );

      // Kiểm tra kết quả câu lệnh UPDATE đầu tiên
      if (updateResult1.affectedRows === 0) {
        // Không tìm thấy bản ghi nào phù hợp với điều kiện WHERE
        throw new Error(
          "Không tìm thấy bản ghi phù hợp trong câu lệnh UPDATE đầu tiên."
        );
      }

      // Câu lệnh UPDATE thứ hai
      const updateResult2 = await connect.query(
        "UPDATE product SET name=? WHERE brands = ?",
        [name, brand]
      );

      // Kiểm tra kết quả câu lệnh UPDATE thứ hai
      if (updateResult2.affectedRows === 0) {
        // Không tìm thấy bản ghi nào phù hợp với điều kiện WHERE
        throw new Error(
          "Không tìm thấy bản ghi phù hợp trong câu lệnh UPDATE thứ hai."
        );
      }
    } catch (err) {
      // Xử lý lỗi nếu có
      console.error("Lỗi trong quá trình thực hiện câu lệnh UPDATE:", err);
      res.status(500).send("Đã xảy ra lỗi trong quá trình cập nhật dữ liệu.");
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
  }
});
route.get("/delete/:id", async (req, res) => {
  const inputString = req.params.id;
  const splittedStrings = inputString.split("-");
  // Lấy hai chuỗi đã tách ra
  const firstPart = splittedStrings[0];
  const secondPart = splittedStrings[1];
  const ImageFileName = splittedStrings[2] + "-" + splittedStrings[3];
  // await connect.query("Delete from product WHERE brands = ? and name = ?", [
  //   firstPart,
  //   secondPart,
  // ]);
  const response = await axios.delete(
    `http://localhost:3000/api/${firstPart}/${secondPart}`
  );

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
