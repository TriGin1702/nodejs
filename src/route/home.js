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
// const { router } = require("json-server");
handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

handlebars.registerHelper("parseJSON", function (json) {
  return JSON.parse(json);
});
handlebars.registerHelper("ifHasAuthority", function (authority, authorities, options) {
  if (Array.isArray(authorities) && authorities.some((auth) => auth.authority_name === authority)) {
    return options.fn(this);
  }
  return options.inverse(this);
});

handlebars.registerHelper("firstImage", function (image) {
  if (typeof image == "string") {
    try {
      const parsedArray = JSON.parse(image); // Parse chuỗi JSON thành mảng
      return parsedArray ? parsedArray[0] : null; // Trả về phần tử đầu tiên nếu tồn tại
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null; // Trả về null nếu lỗi parse JSON
    }
  }
  return null; // Trả về null nếu image không phải là chuỗi JSON
});
handlebars.registerHelper("isFirstOccurrence", function (currentId, previousId, options) {
  if (currentId !== previousId) {
    return options.fn(this); // Render nội dung trong block {{#isFirstOccurrence}}
  }
  return options.inverse(this); // Render nội dung trong block {{else}}
});
handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/image");
  },
  filename: (req, file, cb) => {
    cb(null, time + "-" + file.originalname);
  },
});
const upload = multer({ storage });
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

route.post("/update/:id", upload.array("image", 7), async (req, res) => {
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
        resolve(result.length > 0 ? JSON.parse(result[0].image) : []); // Assuming image is stored as JSON
      });
    });
    console.log(currentImages);
    const { brand, name, description, type, price } = req.body;
    let newImages = currentImages; // Giữ nguyên ảnh cũ mặc định
    // Nếu có ảnh mới được tải lên
    if (req.files && req.files.length) {
      // Xóa ảnh cũ
      newImages = [];
      currentImages.forEach((image) => {
        const filePath = path.join(imageFilePath, image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Xóa file
          console.log(`Deleted: ${filePath}`);
        } else {
          console.log(`File not found: ${filePath}`);
        }
      });

      // Tạo danh sách ảnh mới
      req.files.forEach((file) => {
        const sanitizedFileName = file.originalname;
        const fileName = `${time}-${sanitizedFileName}`; // Tạo tên file mới
        newImages.push(fileName); // Thêm tên file vào mảng mới
        // const filePath = path.join(imageFilePath, fileName);
        // fs.writeFileSync(filePath, fileName); // Lưu file
        // console.log(`${fileName} has been saved.`);
      });
    }
    console.log(newImages);
    // Cập nhật sản phẩm trong cơ sở dữ liệu
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

    return res.status(200).redirect("/homepage");
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

    const token = req.cookies.token;

    // Call the API to delete the product
    await axios.delete(`${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_PRODUCT}/${idProduct}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send token through the Authorization header
      },
    });

    // Delete each image file from the filesystem

    return res.redirect("/homepage");
  } catch (err) {
    console.error("Error during DELETE operation:", err);
    return res.status(500).send("Error deleting the product.");
  }
});
route.get("/reset/:id_product", async function (req, res) {
  const id_product = req.params.id_product;

  try {
    // Thực hiện cập nhật is_hidden = 0 cho sản phẩm có id_product
    await new Promise((resolve, reject) => {
      connect.query("UPDATE product SET is_hidden = 0 WHERE id_product = ?", [id_product], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    // Gửi phản hồi thành công
    return res.redirect("/homepage");
  } catch (err) {
    // Xử lý lỗi
    console.error(err);
    res.status(500).send("Error resetting product visibility.");
  }
});

// route.use("/create", create);
route.get("/", async (req, res) => {
  try {
    const admin = req.session.admin || null;
    if (admin == null) {
      return res.redirect("/");
    }
    let product, city, manufacture, authorities;
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
    const visibleProducts = product.filter((item) => item.is_hidden === 0);
    const hiddenProducts = product.filter((item) => item.is_hidden === 1);
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
    await new Promise((resolve, reject) => {
      const query = `
        SELECT a.name AS authority_name
          FROM role r
          JOIN authority a ON r.id_role = a.id_role
          WHERE r.name = ?;`;
      connect.query(query, [admin.role_name], (err, result) => {
        if (err) reject(err);
        authorities = result;
        resolve();
      });
    });
    console.log(manufacture.data);
    console.log(authorities);
    // req.app.locals.product = product;
    return res.render("home", {
      visibleProducts: visibleProducts,
      hiddenProducts: hiddenProducts,
      city: city,
      manufacture: manufacture[0],
      admin_role: authorities,
    });
  } catch (err) {
    return res.send(err);
  }
});
route.get("/admin", async (req, res) => {
  try {
    const role = await new Promise((resolve, reject) => {
      connect.query("SELECT * from role", (err, result) => {
        if (err) reject(err);
        const filteredRoles = result.filter((role) => role.name !== "user");
        resolve(filteredRoles);
      });
    });

    const authority = await new Promise((resolve, reject) => {
      connect.query("SELECT * from authority", (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
    const authorityforchose = await new Promise((resolve, reject) => {
      connect.query("SELECT DISTINCT id_au, name FROM authority", (err, result) => {
        if (err) reject(err);
        const filteredAuthorities = result.filter((auth) => auth.name !== "buy product");
        resolve(filteredAuthorities);
      });
    });

    const user = await new Promise((resolve, reject) => {
      connect.query("SELECT user.*, role.name AS role_name FROM user INNER JOIN role ON user.id_role = role.id_role", (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
    console.log(user);
    return res.render("admin", { user, role, authority, authorityforchose });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

route.get("/reset_user/:id", async (req, res) => {
  const id_user = req.params.id;
  await new Promise((resolve, reject) => {
    const sqlUpdateIsBan = `UPDATE user SET is_ban = 0 WHERE id_user = ?`;
    connect.query(sqlUpdateIsBan, [id_user], (err, results) => {
      if (err) return reject(err);
      resolve();
    });
  });
  return res.redirect("/homepage/admin");
});
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
          resolve();
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
          resolve();
        });
      }
    });

    return res.redirect("/homepage/admin"); // Trả về kết quả cho client
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
      const sqlCheckUser = `SELECT r.name FROM user u,role r WHERE id_user = ? AND u.id_role = r.id_role`;
      connect.query(sqlCheckUser, [id_user], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return reject(new Error("User not found"));
        resolve(results[0]);
      });
    });
    console.log(user);
    if (user.name == "user") {
      // Nếu tên là "user", chỉ cập nhật cột is_ban thành true
      await new Promise((resolve, reject) => {
        const sqlUpdateIsBan = `UPDATE user SET is_ban = 1 WHERE id_user = ?`;
        connect.query(sqlUpdateIsBan, [id_user], (err, results) => {
          if (err) return reject(err);
          resolve();
        });
      });

      // Chuyển hướng đến trang admin sau khi cấm người dùng
      return res.send("OK");
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
      return res.send("OK");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing the user" });
  }
});

route.get("/bill_admin", async (req, res) => {
  const admin = req.session.admin || null;
  const sql =
    "SELECT bi.id_bill,bi.id_user, bi.create_at, bi.status, bi.price AS total_price, JSON_ARRAYAGG(JSON_OBJECT('id_product', p.id_product, 'product_name', p.name, 'image', JSON_EXTRACT(p.image, '$[0]'), 'brand_name', b.name, 'cart_quantity', c.quantity)) AS products FROM bill bi JOIN bill_detail bd ON bi.id_bill = bd.id_bill JOIN cart c ON c.id_cart = bd.id_cart JOIN product p ON p.id_product = c.id_product JOIN brand b ON b.id_brand = p.id_brand GROUP BY bi.id_bill;";
  if (admin == null) {
    return res.redirect("/");
  } else {
    try {
      const cart = await new Promise((resolve, reject) => {
        connect.query(sql, (error, results) => {
          if (error) {
            console.error("Error:", error);
            reject(error); // Reject promise nếu có lỗi
          } else {
            resolve(results); // Resolve promise nếu thủ tục thực thi thành công
          }
        });
      });

      let cartorder = cart;
      // Gắn isFirstOccurrence cho từng dòng
      cartorder = cartorder.map((item, index, array) => {
        item.isFirstOccurrence = index === 0 || item.id_bill !== array[index - 1].id_bill;
        return item;
      });
      // Tách ra hai danh sách dựa vào status
      const pendingOrders = cartorder.filter((item) => item.status === "Pending");
      const confirmedOrders = cartorder.filter((item) => item.status === "Confirm");
      const hasOrders = pendingOrders.length > 0 || confirmedOrders.length > 0;
      return res.render("bill_admin", { pendingOrders, confirmedOrders, hasOrders });
    } catch (error) {
      console.error("Error fetching cart orders:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
});
route.get("/bill_admin/:id_bill", async (req, res) => {
  const admin = req.session.admin || null;
  const id_bill = req.params.id_bill;
  const sql = "UPDATE bill SET status = 'Confirm' WHERE id_bill = ?";
  if (admin == null) {
    return res.redirect("/");
  } else {
    try {
      await new Promise((resolve, reject) => {
        connect.query(sql, [id_bill], (error, results) => {
          if (error) {
            console.error("Error:", error);
            reject(error); // Reject promise nếu có lỗi
          } else {
            resolve(results); // Resolve promise nếu thủ tục thực thi thành công
          }
        });
      });
      return res.redirect("/homepage/bill_admin");
    } catch (error) {
      console.error("Error fetching cart orders:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
});
route.post("/imported", upload.none(), async (req, res) => {
  const { id_manufacturer, name, phoneNumber, id_district, address, products, importStatus } = req.body;

  try {
    // Thêm hoặc cập nhật địa chỉ nhà sản xuất
    const addressResult = await new Promise((resolve, reject) => {
      connect.query(
        "CALL AddOrUpdateManufacturerAddress(?,?,?,?,?)",
        [id_manufacturer, name, phoneNumber, address, id_district],
        (error, results) => {
          if (error) return reject(error);
          else resolve(results[0][0].success); // Kết quả trả về từ stored procedure
        }
      );
    });

    // Tạo một hóa đơn nhập mới
    const idImportOrder = await new Promise((resolve, reject) => {
      connect.query("INSERT INTO import_order (id_manufacturer, status) VALUES (?, ?)", [addressResult, importStatus], (error, results) => {
        if (error) return reject(error);
        else resolve(results.insertId); // Lấy id_import_order vừa được tạo
      });
    });

    // Kiểm tra và xử lý các sản phẩm trong mảng products
    if (Array.isArray(products) && products.length > 0) {
      for (const product of products) {
        // Gọi stored procedure AddImportOrder cho từng sản phẩm
        await new Promise((resolve, reject) => {
          connect.query("CALL AddImportOrder(?,?,?,?)", [idImportOrder, product.id_product, product.quantity, product.price], (error, results) => {
            if (error) return reject(error);
            resolve(results);
          });
        });
      }
      console.log(`Đã thêm ${products.length} sản phẩm vào đơn hàng có ID: ${idImportOrder}.`);
    } else {
      console.log("Không có sản phẩm nào được chọn.");
    }

    return res.redirect("/homepage");
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
route.get("/city", async (req, res) => {
  const sql = "SELECT * from city";
  try {
    const citys = await new Promise((resolve, reject) => {
      connect.query(sql, (err, results) => {
        if (err) reject(err);
        resolve(results); // Trả về kết quả từ cơ sở dữ liệu
      });
    });
    return res.json(citys); // Trả về kết quả cho client
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

      return res.redirect("/homepage/admin");
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

      return res.redirect("/homepage/admin");
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
route.get("/import_bill", async function (req, res) {
  const importbill = await new Promise((resolve, reject) => {
    connect.query("CALL GetALLimportBill()", (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
  let city, manufacture;
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
  return res.render("import", { importbill: importbill, city: city, manufacture: manufacture[0] });
});
route.post("/import_bill", upload.none(), async (req, res) => {
  const { id_manufacturer, name, phoneNumber, id_district, address, products, importStatus, import_order_id } = req.body;

  try {
    // Thêm hoặc cập nhật địa chỉ nhà sản xuất
    const addressResult = await new Promise((resolve, reject) => {
      connect.query(
        "CALL AddOrUpdateManufacturerAddress(?,?,?,?,?)",
        [id_manufacturer, name, phoneNumber, address, id_district],
        (error, results) => {
          if (error) return reject(error);
          else resolve(results[0][0].success); // Kết quả trả về từ stored procedure
        }
      );
    });
    let total_price = 0;
    if (Array.isArray(products) && products.length > 0) {
      for (const product of products) {
        // Gọi stored procedure AddImportOrder cho từng sản phẩm
        await new Promise((resolve, reject) => {
          connect.query(
            "CALL UpdateProductAndImportOrderDetail(?,?,?,?)",
            [import_order_id, product.id_product, product.quantity, product.price],
            (error, results) => {
              if (error) return reject(error);
              resolve(results);
            }
          );
        });
        total_price += product.quantity * product.price;
      }
    } else {
      console.log("Không có sản phẩm nào được chọn.");
    }
    // Tạo một hóa đơn nhập mới
    await new Promise((resolve, reject) => {
      connect.query(
        "UPDATE import_order SET id_manufacturer = ?, status =?, total_price =? WHERE id_import_order =? ",
        [addressResult, importStatus, total_price, import_order_id],
        (error, results) => {
          if (error) return reject(error);
          else resolve(results); // Lấy id_import_order vừa được tạo
        }
      );
    });

    return res.redirect("/homepage/import_bill");
  } catch (error) {
    console.error("Error occurred while processing import:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
route.delete("/delete_import_order", async (req, res) => {
  const { import_order_id } = req.body;

  if (!import_order_id) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin import_order_id." });
  }

  try {
    // Gọi stored procedure để xóa import_order và các chi tiết liên quan
    await new Promise((resolve, reject) => {
      connect.query("CALL DeleteImportOrder(?)", [import_order_id], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    // Phản hồi thành công
    return res.status(200).json({ success: true, message: "Hóa đơn nhập đã được xóa thành công." });
  } catch (error) {
    console.error("Error occurred while deleting import order:", error);
    return res.status(500).json({ success: false, message: "Đã xảy ra lỗi trong quá trình xóa hóa đơn nhập." });
  }
});

module.exports = route;
