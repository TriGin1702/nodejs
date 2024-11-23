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
    const type = await new Promise((resolve, reject) => {
      connect.query("SELECT * FROM product_type", (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
    res.render("create", { brand: brand, type: type });
  } catch (err) {
    console.error(err);
    res.send("error"); // Xử lý lỗi nếu truy vấn không thành công
  }
});
router2.post("/addProductType", upload.array("image", 15), async (req, res) => {
  const { name, gender } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !description) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  const sql = "INSERT INTO product_type (name, gender) VALUES (?, ?)";
  const values = [name, gender];
  await new Promise((resolve, reject) => {
    connect.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error inserting product type", error: err });
      }
      resolve(result);
    });
  });
});
router2.post("/addBrand", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Please provide the brand name" });
  }

  const sql = "INSERT INTO brand (name) VALUES (?)";
  const values = [name];

  try {
    await new Promise((resolve, reject) => {
      connect.query(sql, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
    res.status(201).json({ message: "Brand added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error inserting brand", error: err });
  }
});

router2.post("/", upload.array("image", 15), async (req, res) => {
  const products = [];
  const images = req.files; // Lấy danh sách ảnh từ req.files
  const names = req.body.name;
  const descriptions = req.body.description;
  const prices = req.body.price;
  const brands = req.body.brand;
  const types = req.body.type;

  // Tạo mảng sản phẩm
  for (let i = 0; i < names.length; i++) {
    const imageArray = []; // Mảng để chứa tên ảnh
    if (images && images.length > 0) {
      // Lặp qua các file ảnh đã upload
      for (let j = i * 5; j < i * 5 + 5; j++) {
        // Kiểm tra và lưu tên file
        const fileName = time + "-" + images[j].originalname;
        imageArray.push(fileName); // Thêm tên file vào mảng
      }
    } else {
      imageArray.push("anhthu.png"); // Thêm ảnh mặc định nếu không có ảnh nào
    }

    // Tạo đối tượng sản phẩm
    const product = {
      name: names[i],
      description: descriptions[i],
      price: prices[i],
      id_brand: brands[i],
      id_type: types[i],
      image: JSON.stringify(imageArray), // Chuyển đổi mảng thành chuỗi JSON
    };

    products.push(product); // Thêm sản phẩm vào mảng
  }

  // Lưu mảng sản phẩm vào cơ sở dữ liệu
  const sql = "INSERT INTO product (id_brand, name, description, id_type, price, image) VALUES (?, ?, ?, ?, ?, ?)";
  for (const product of products) {
    try {
      await new Promise((resolve, reject) => {
        connect.query(sql, [product.id_brand, product.name, product.description, product.id_type, product.price, product.image], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
      console.log("Product inserted:", product);
    } catch (err) {
      console.error("Error inserting product:", err);
    }
  }
  return res.redirect("/homepage");
});
// Route cho Brand
router2.post("/brand/addBrand", async (req, res) => {
  const { name } = req.body;
  const sql = "INSERT INTO brand (name) VALUES (?)";
  console.log(name);
  try {
    await new Promise((resolve, reject) => {
      connect.query(sql, [name], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
    return res.status(201).json({ message: "Brand added successfully" });
  } catch (err) {
    return res.status(500).json({ message: "lỗi", error: err });
  }
});

router2.post("/brand/editBrand", async (req, res) => {
  const { id, newName } = req.body;
  const sql = "UPDATE brand SET name = ? WHERE id_brand = ?";

  try {
    await new Promise((resolve, reject) => {
      connect.query(sql, [newName, id], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
    return res.status(200).json({ message: "Brand updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error editing brand", error: err });
  }
});

router2.post("/brand/deleteBrand", async (req, res) => {
  const { id } = req.body;
  const sql = "DELETE FROM brand WHERE id_brand = ?";

  try {
    await new Promise((resolve, reject) => {
      connect.query(sql, [id], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
    return res.status(200).json({ message: "Brand deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting brand", error: err });
  }
});

// Route cho Product Type
router2.post("/type/addType", async (req, res) => {
  const { name } = req.body;
  console.log(name);
  const sql = "INSERT INTO product_type (name) VALUES (?)";

  try {
    await new Promise((resolve, reject) => {
      connect.query(sql, [name], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
    return res.status(201).json({ message: "Product type added successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error adding product type", error: err });
  }
});

router2.post("/type/editType", async (req, res) => {
  const { id, newName } = req.body;
  const sql = "UPDATE product_type SET name = ? WHERE id_type = ?";

  try {
    await new Promise((resolve, reject) => {
      connect.query(sql, [newName, id], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
    return res.status(200).json({ message: "Product type updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error editing product type", error: err });
  }
});

router2.post("/type/deleteType", async (req, res) => {
  const { id } = req.body;
  const sql = "DELETE FROM product_type WHERE id_type = ?";

  try {
    await new Promise((resolve, reject) => {
      connect.query(sql, [id], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
    return res.status(200).json({ message: "Product type deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting product type", error: err });
  }
});

module.exports = router2;
