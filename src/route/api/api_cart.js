const express = require("express");
const connect = require("../../app/control/connect");
const router = express.Router();
const authenticateToken = require("./authenticateToken");

router.post("/quantity", authenticateToken, async function (req, res) {
  const { checkedProducts, user_id, quantity } = req.body;
  console.log({ checkedProducts, user_id, quantity });
  try {
    if (!user_id) {
      return res.status(401).json({ message: "User not logged in." });
    }
    const sql = "CALL UpdateCart(?, ?, ?)";
    await new Promise((resolve, reject) => {
      connect.query(sql, [user_id, checkedProducts, quantity], (error, results) => {
        if (error) {
          console.error("Error updating quantity:", error);
          reject(error);
        } else {
          resolve(results);
          console.log(results);
          console.log(resolve(results));
        }
      });
    });
    return res.status(200).json({ message: "Quantity updated successfully." });
  } catch (error) {
    console.error("Error updating quantity:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});
router.delete("/delete/:user_id", authenticateToken, async (req, res) => {
  const user_id = req.params.user_id;
  const { id_cart } = req.body;
  try {
    // Xóa dòng trong bảng bill dựa trên id sản phẩm
    const deleteProductSql = "DELETE FROM cart WHERE id_cart = ? and id_user = ?";
    await new Promise((resolve, reject) => {
      connect.query(deleteProductSql, [id_cart, user_id], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    return res.status(200).json({ message: "Product deleted from bill successfully." });
  } catch (error) {
    console.error("Error deleting product from bill:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});
router.post("/address", authenticateToken, async (req, res) => {
  const { id_useraddress, user_id, name, phoneNumber, id_pay, district, address, checkedProducts } = req.body;
  try {
    if (!user_id) {
      return res.status(400).json({ success: false, message: "User ID not found in request body" });
    }
    const result_address = await new Promise((resolve, reject) => {
      connect.query("CALL AddOrUpdateUserAddress(?,?,?,?,?,?)", [id_useraddress, user_id, name, phoneNumber, address, district], (error, results) => {
        if (error) {
          console.error("Error inserting address:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    // Xác định id_useraddress từ kết quả trả về (có thể là last_insert_id hoặc ID đã được trả về)
    const user_address = result_address[0][0].success; // Lấy id_useraddress từ kết quả của stored procedure

    // Thêm dữ liệu vào bảng bill
    const insertBillResult = await new Promise((resolve, reject) => {
      connect.query("INSERT INTO bill (id_user, id_pay, status) VALUES (?, ?, ?)", [user_id, id_pay, "Pending"], (error, results) => {
        if (error) {
          console.error("Error inserting bill:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    // Lấy id_bill vừa tạo
    const id_bill = insertBillResult.insertId;

    // Thêm dữ liệu vào bảng bill_address
    await new Promise((resolve, reject) => {
      connect.query("INSERT INTO bill_address (id_bill, id_useraddress) VALUES (?, ?)", [id_bill, user_address], (error, results) => {
        if (error) {
          console.error("Error inserting bill_address:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    for (const product of checkedProducts) {
      await new Promise((resolve, reject) => {
        connect.query("CALL AddToBillDetailAndUpdatePrice(?,?)", [id_bill, product.id_cart], (error, results) => {
          if (error) {
            console.error("Error processing data:", error);
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      console.log("PRODUCT_CART", product.id_cart);
    }

    res.status(200).json({ success: true, message: "Data processed successfully" });
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).json({ success: false, error: "Error processing data" });
  }
});
router.get("/:user_id", authenticateToken, async function (req, res) {
  try {
    // Lấy user_id từ params
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({ success: false, message: "User ID not found in request params" });
    }

    // Truy vấn dữ liệu cart
    const data_cart = await new Promise((resolve, reject) => {
      connect.query(
        `SELECT cart.*, product.name AS product_name, product.image, brand.name AS brand_name 
         FROM cart 
         JOIN product ON cart.id_product = product.id_product 
         JOIN brand ON product.id_brand = brand.id_brand 
         WHERE cart.id_user = ? AND cart.addbill = 0;`,
        [user_id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    // Truy vấn địa chỉ chi tiết
    const user_address = await new Promise((resolve, reject) => {
      connect.query(
        `SELECT 
           ua.id_useraddress,
           ua.id_user,
           a.id_address,
           a.name AS name,
           a.phone AS phone,
           a.ip_address,
           a.id_district as id_district,
           d.name AS district_name,
           c.id_city as id_city,
           c.name AS city_name
         FROM user_address ua
         JOIN address a ON ua.id_address = a.id_address
         JOIN district d ON a.id_district = d.id_district
         JOIN city c ON d.id_city = c.id_city
         WHERE ua.id_user = ?;`,
        [user_id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    // Truy vấn dữ liệu từ bảng payment
    const payment_details = await new Promise((resolve, reject) => {
      connect.query(
        `SELECT * 
         FROM payment`,
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
    const citys = await new Promise((resolve, reject) => {
      connect.query("SELECT * FROM city", (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    // Trả về kết quả
    res.json({
      success: true,
      data: data_cart,
      user_address: user_address,
      payment: payment_details,
      citys: citys,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/:user_id", authenticateToken, async function (req, res) {
  try {
    // Lấy user_id, brand, và name từ body của request
    const { idProduct } = req.body;
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "Missing user ID, brand, or name in request body",
      });
    }

    // Gọi stored procedure AddProductToCart với các tham số từ client
    const result = await new Promise((resolve, reject) => {
      connect.query("CALL AddToCart(?, ?, ?)", [user_id, idProduct, 1], (error, results) => {
        if (error) {
          // Xử lý lỗi khi gọi stored procedure
          console.error("Error:", error);
          reject(error);
        } else {
          // Lấy giá trị success_flag từ kết quả trả về
          const success_flag = results[0][0].success;

          // Kiểm tra giá trị success_flag để xác định kết quả thành công hay không
          if (success_flag === 1) {
            // Nếu thành công, trả về phản hồi thành công
            resolve({
              success: true,
              message: "Product added to cart successfully",
            });
          } else {
            // Nếu không thành công, trả về phản hồi thất bại
            reject(new Error("Failed to add product to cart"));
          }
        }
      });
    });
    return res.status(200).send(result);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
module.exports = router;
