const express = require("express");
const connect = require("../app/control/connect");
const fs = require("fs");
const path = require("path");
const imageFilePath = path.join(__dirname, "../public/image/");
const route = express.Router();
const multer = require("multer");
const { error } = require("console");
const time = Date.now();
const axios = require("axios");
// const cookieParser = require("cookie-parser"); // Import cookie-parser
// route.use(cookieParser());
require("dotenv").config();
const handlebars = require("handlebars");
const { router } = require("json-server");
handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

handlebars.registerHelper("parseJSON", function (json) {
  return JSON.parse(json);
});
handlebars.registerHelper("firstImage", function (array) {
  const parsedArray = JSON.parse(array); // Parse mảng JSON
  return parsedArray && parsedArray.length ? parsedArray[0] : null; // Lấy phần tử đầu tiên nếu tồn tại
});
handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

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
// route.get('/list_users', async(req, res) => {
//     try {
//         const admin = req.session.admin || null;
//         if (admin == null) {
//             return res.redirect('/');
//         }
//         const token = req.cookies.adminToken;
//         const url = `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_ACC}/list_users`;
//         console.log('Fetching users from URL:', url);

//         const listusers = await axios.get(url, {
//             headers: {
//                 'Authorization': `Bearer ${token}` // Gửi token qua header Authorization
//             }
//         });
//         const users = listusers.data;
//         console.log(users);
//         return res.render('list_user', { users: users });
//     } catch (err) {
//         return res.send(err);
//     }
// });
route.post("/home", upload.array("image", 5), async (req, res) => {
  const sql = "INSERT INTO product (id_brand, name, description, id_type, price, image) VALUES (?, ?, ?, ?, ?, ?)";
  const { brand, name, description, type, price } = req.body;
  const imageArray = [];
  console.log(req.files);
  if (req.files && req.files.length) {
    req.files.forEach((file) => {
      const fileName = `${time}-${file.originalname}`;
      imageArray.push(fileName);
    });
  } else {
    imageArray.push("default-image.png"); // Default image if no files uploaded
  }
  console.log(imageArray);
  try {
    await new Promise((resolve, reject) => {
      connect.query(sql, [brand, name, description, type, price, JSON.stringify(imageArray)], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
    res.redirect("/homepage"); // Redirect or respond as needed
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send("Internal Server Error");
  }
});

route.get("/update/:id", async (req, res) => {
  const admin = req.session.admin || null;
  if (admin == null) {
    return res.redirect("/");
  }

  const idProduct = req.params.id;

  try {
    const product = await new Promise((resolve, reject) => {
      connect.query("SELECT * FROM product WHERE id_product = ?", [idProduct], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    const brands = await new Promise((resolve, reject) => {
      connect.query("SELECT * FROM brand", (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    const productTypes = await new Promise((resolve, reject) => {
      connect.query("SELECT id_type, name FROM product_type", (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    return res.render("update", { product: product[0], brands, productTypes });
  } catch (err) {
    return res.send(err);
  }
});

route.post("/update/:id", upload.array("image", 5), async (req, res) => {
  const admin = req.session.admin || null;
  if (admin == null) {
    return res.redirect("/");
  }

  const idProduct = req.params.id; // Get the product ID from the request parameters

  try {
    // Get the current image array from the database
    const currentImages = await new Promise((resolve, reject) => {
      connect.query("SELECT image FROM product WHERE id_product = ?", [idProduct], (err, result) => {
        if (err) reject(err);
        resolve(JSON.parse(result[0].image)); // Assuming image is stored as JSON
      });
    });

    const { brand, name, description, type, price } = req.body;
    let newImages = [...currentImages]; // Start with current images

    // If new images are uploaded, append them to the existing images
    if (req.files && req.files.length) {
      req.files.forEach((file) => {
        const fileName = `${time}-${file.originalname}`; // Create a new filename
        newImages.push(fileName); // Add the new image to the array

        // Save the new image to the filesystem
        const filePath = path.join(imageFilePath, fileName);
        fs.writeFileSync(filePath, file.buffer); // Save the file
        console.log(`${fileName} has been saved.`);
      });
    }

    // Update the product in the database
    await new Promise((resolve, reject) => {
      connect.query(
        "UPDATE product SET id_brand = ?, name = ?, description = ?, id_type = ?, price = ?, image = ? WHERE id_product = ?",
        [brand, name, description, type, price, JSON.stringify(newImages), idProduct],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    return res.redirect("/homepage");
  } catch (err) {
    console.error("Error during UPDATE operation:", err);
    return res.status(500).send("Error updating the product.");
  }
});

route.get("/delete/:id", upload.none(), async (req, res) => {
  // const admin = req.session.admin || null;
  // if (admin == null) {
  //   return res.redirect("/");
  // }

  const idProduct = req.params.id; // Get the product ID from the request parameters
  try {
    // Retrieve the current image array from the database to delete files
    const imagesToDelete = await new Promise((resolve, reject) => {
      connect.query("SELECT image FROM product WHERE id_product = ?", [idProduct], (err, result) => {
        if (err) reject(err);
        resolve(JSON.parse(result[0].image)); // Assuming image is stored as JSON
      });
    });

    const token = req.cookies.adminToken;

    // Call the API to delete the product
    await axios.delete(`${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_PRODUCT}/${idProduct}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send token through the Authorization header
      },
    });

    // Delete each image file from the filesystem
    imagesToDelete.forEach((imageName) => {
      const fullImagePath = path.join(imageFilePath, imageName);
      if (fs.existsSync(fullImagePath)) {
        fs.unlinkSync(fullImagePath); // Delete the image if it exists
        console.log(`${imageName} has been deleted.`);
      } else {
        console.log(`File ${imageName} does not exist, no deletion required.`);
      }
    });

    return res.redirect("/homepage");
  } catch (err) {
    console.error("Error during DELETE operation:", err);
    return res.status(500).send("Error deleting the product.");
  }
});

// route.use("/create", create);
route.get("/", async (req, res) => {
  try {
    // const admin = req.session.admin || null;
    // if (admin == null) {
    //   return res.redirect("/");
    // }
    let product, city, manufacture;
    await new Promise((resolve, reject) => {
      connect.query(
        "SELECT product.*,p.name AS brand_name, pr.name AS product_nametype FROM product JOIN brand p ON product.id_brand = p.id_brand JOIN product_type pr ON product.id_type = pr.id_type;",
        (err, result) => {
          if (err) reject(err);
          product = result;
          resolve();
        }
      );
    });
    await new Promise((resolve, reject) => {
      connect.query("SELECT * from city", (err, result) => {
        if (err) reject(err);
        city = result;
        resolve();
      });
    });
    await new Promise((resolve, reject) => {
      connect.query("CALL GetManufacturerInfo(0)", (err, result) => {
        if (err) reject(err);
        manufacture = result;
        resolve();
      });
    });
    console.log(manufacture.data);
    // req.app.locals.product = product;
    return res.render("home", { product: product, city: city, manufacture: manufacture[0] });
  } catch (err) {
    return res.send(err);
  }
});
route.get("/admin", async (req, res) => {
  try {
    const role = await new Promise((resolve, reject) => {
      connect.query("SELECT * from role", (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    const authority = await new Promise((resolve, reject) => {
      connect.query("SELECT * from authority", (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    const user = await new Promise((resolve, reject) => {
      connect.query("SELECT user.*, role.name AS role_name FROM user INNER JOIN role ON user.id_role = role.id_role", (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    return res.render("admin", { user, role, authority });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

// route.get("/user", (req, res) => {
//   return res.render("createUser");
// });
route.post("/user", async (req, res) => {
  const { id_user, id_role, name, gender, email, account, password } = req.body;

  try {
    const result = await new Promise((resolve, reject) => {
      if (id_user == 0) {
        // Thêm mới người dùng
        const sqlInsert = `
          INSERT INTO user (id_role, name, gender, email, account, password)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        connect.query(sqlInsert, [id_role, name, gender, email, account, password], (err, results) => {
          if (err) return reject(err);
          resolve({ message: "User created successfully!", id: results.insertId });
        });
      } else {
        // Cập nhật người dùng hiện có
        const sqlUpdate = `
          UPDATE user 
          SET id_role = ?, name = ?, gender = ?, email = ?, account = ?, password = ?
          WHERE id_user = ?
        `;
        connect.query(sqlUpdate, [id_role, name, gender, email, account, password, id_user], (err, results) => {
          if (err) return reject(err);
          resolve({ message: "User updated successfully!" });
        });
      }
    });

    return res.json(result); // Trả về kết quả cho client
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing user data" });
  }
});
route.delete("/user/:id", async (req, res) => {
  const id_user = req.params.id;

  try {
    // Kiểm tra tên của người dùng để xác định hành động
    const user = await new Promise((resolve, reject) => {
      const sqlCheckUser = `SELECT name FROM user WHERE id_user = ?`;
      connect.query(sqlCheckUser, [id_user], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return reject(new Error("User not found"));
        resolve(results[0]);
      });
    });

    if (user.name === "user") {
      // Nếu tên là "user", chỉ cập nhật cột is_ban thành true
      await new Promise((resolve, reject) => {
        const sqlUpdateIsBan = `UPDATE user SET is_ban = true WHERE id_user = ?`;
        connect.query(sqlUpdateIsBan, [id_user], (err, results) => {
          if (err) return reject(err);
          resolve();
        });
      });

      // Chuyển hướng đến trang admin sau khi cấm người dùng
      return res.redirect("/homepage/admin");
    } else {
      // Nếu không, xóa người dùng
      await new Promise((resolve, reject) => {
        const sqlDeleteUser = `DELETE FROM user WHERE id_user = ?`;
        connect.query(sqlDeleteUser, [id_user], (err, results) => {
          if (err) return reject(err);
          resolve();
        });
      });

      // Chuyển hướng đến trang admin sau khi xóa người dùng
      return res.redirect("/homepage/admin");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing the user" });
  }
});

// route.get("/import", (req, res) => {
//   return res.render("import");
// });
route.post("/imported", upload.none(), async (req, res) => {
  const { id_manufacturer, name, phoneNumber, id_district, address, products, importStatus } = req.body;

  try {
    const addressResult = await new Promise((resolve, reject) => {
      connect.query(
        "CALL AddOrUpdateManufacturerAddress(?,?,?,?,?)",
        [id_manufacturer, name, phoneNumber, address, id_district],
        (error, results) => {
          if (error) return reject(error);
          else {
            resolve(results[0][0].success);
          }
        }
      );
    });
    console.log(addressResult);
    // Kiểm tra products là mảng hợp lệ và có phần tử
    if (Array.isArray(products) && products.length > 0) {
      const productCount = products.length; // Đếm số lượng sản phẩm

      if (productCount > 0) {
        for (const product of products) {
          await new Promise((resolve, reject) => {
            connect.query(
              "CALL AddImportOrder(?,?,?,?,?)", // Giả sử cần thêm id_product và quantity cho mỗi sản phẩm
              [addressResult, product.id_product, product.quantity, product.price, importStatus],
              (error, results) => {
                if (error) return reject(error);
                resolve(results);
              }
            );
          });
        }
        console.log(`Đã thêm ${productCount} sản phẩm vào đơn hàng.`);
      }
    } else {
      console.log("Không có sản phẩm nào được chọn.");
    }

    return res.json({ success: true, message: "Import order created successfully" });
  } catch (error) {
    console.error("Error occurred while processing import:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
route.get("/district/:id", async (req, res) => {
  const id_city = req.params.id;
  const sql = "SELECT * from district WHERE id_city = ?";
  try {
    const district = await new Promise((resolve, reject) => {
      connect.query(sql, [id_city], (err, results) => {
        if (err) reject(err);
        resolve(results); // Trả về kết quả từ cơ sở dữ liệu
      });
    });
    return res.json(district); // Trả về kết quả cho client
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while fetching districts" });
  }
});

route.post("/role", async (req, res) => {
  const { id_role, name, selectedAuthorities } = req.body;
  console.log(selectedAuthorities, name, id_role);
  // Tách selectedAuthorities thành mảng các đối tượng { id_au, name }
  const authoritiesArray = selectedAuthorities
    .split(",")
    .map((item) => {
      const [id_au, authName] = item.split("-");
      return {
        id_au: parseInt(id_au),
        name: authName,
      };
    })
    .filter((auth) => !isNaN(auth.id_au) && auth.name); // Loại bỏ các giá trị không hợp lệ

  try {
    if (id_role != 0) {
      // Xóa tất cả các authority hiện tại của role
      const deleteQuery = `DELETE FROM authority WHERE id_role = ?`;
      await new Promise((resolve, reject) => {
        connect.query(deleteQuery, [id_role], (deleteErr) => {
          if (deleteErr) reject(deleteErr);
          resolve();
        });
      });

      // Thêm lại các authority mới cho role
      await Promise.all(
        authoritiesArray.map((auth) => {
          const insertQuery = `
            INSERT INTO authority (id_au,id_role, name)
            VALUES (?, ?, ?)`;
          return new Promise((resolve, reject) => {
            connect.query(insertQuery, [auth.id_au, id_role, auth.name], (insertErr) => {
              if (insertErr) reject(insertErr);
              resolve();
            });
          });
        })
      );

      return res.status(200).json({ message: "Role updated successfully" });
    } else {
      // Tạo role mới và các authority của nó
      const insertRoleQuery = `INSERT INTO role (name) VALUES (?)`;
      const newRoleId = await new Promise((resolve, reject) => {
        connect.query(insertRoleQuery, [name], (err, result) => {
          if (err) reject(err);
          resolve(result.insertId);
        });
      });

      await Promise.all(
        authoritiesArray.map((auth) => {
          const insertAuthorityQuery = `
            INSERT INTO authority (id_au,id_role, name)
            VALUES (?, ?, ?)`;
          return new Promise((resolve, reject) => {
            connect.query(insertAuthorityQuery, [auth.id_au, newRoleId, auth.name], (insertErr) => {
              if (insertErr) reject(insertErr);
              resolve();
            });
          });
        })
      );

      return res.status(200).json({ message: "Role created successfully" });
    }
  } catch (error) {
    console.error("Error handling role:", error);
    return res.status(500).json({ error: "An error occurred while processing the role" });
  }
});
// Route để xóa vai trò
route.delete("/role/:id", async (req, res) => {
  const id_role = req.params.id;

  try {
    // Xóa tất cả các authority của vai trò trước
    await new Promise((resolve, reject) => {
      const sqlDeleteAuthorities = `DELETE FROM authority WHERE id_role = ?`;
      connect.query(sqlDeleteAuthorities, [id_role], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Sau đó xóa vai trò
    const result = await new Promise((resolve, reject) => {
      const sqlDeleteRole = `DELETE FROM role WHERE id_role = ?`;
      connect.query(sqlDeleteRole, [id_role], (err, results) => {
        if (err) return reject(err);
        resolve({ message: "Role deleted successfully!" });
      });
    });

    return res.json(result); // Trả về kết quả cho client
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while deleting the role" });
  }
});

module.exports = route;
