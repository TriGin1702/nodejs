const express = require("express");
const connect = require("../../app/control/connect");
const router = express.Router();
const multer = require("multer");
const upload = multer();
router.post("/quantity", async function (req, res) {
  const { checkedProducts, user_id, quantity } = req.body;
  try {
    if (!user_id) {
      return res.status(401).json({ message: "User not logged in." });
    }

    const sql = "CALL UpdateQuantityAndPrice(?, ?, ?)";
    await new Promise((resolve, reject) => {
      connect.query(
        sql,
        [checkedProducts, user_id, quantity],
        (error, results) => {
          if (error) {
            console.error("Error updating quantity:", error);
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    return res.status(200).json({ message: "Quantity updated successfully." });
  } catch (error) {
    console.error("Error updating quantity:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});
router.delete("/delete/:id", upload.none(), async (req, res) => {
  const cartId = req.params.id;
  try {
    // Xóa dòng trong bảng bill dựa trên id sản phẩm
    const deleteProductSql = "DELETE FROM bill WHERE id_dh = ?";
    await new Promise((resolve, reject) => {
      connect.query(deleteProductSql, [cartId], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    return res
      .status(200)
      .json({ message: "Product deleted from bill successfully." });
  } catch (error) {
    console.error("Error deleting product from bill:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});
router.post("/address", async (req, res) => {
  const {
    user_id,
    name,
    phoneNumber,
    city,
    district,
    address,
    checkedProducts,
  } = req.body;

  try {
    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not found in request body" });
    }

    for (const product of checkedProducts) {
      await new Promise((resolve, reject) => {
        connect.query(
          "CALL InsertOrUpdateAddressAndSetBillStatus(?, ?, ?, ?, ?, ?, ?)",
          [user_id, product, city, district, address, name, phoneNumber],
          (error, results) => {
            if (error) {
              console.error("Error processing data:", error);
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Data processed successfully" });
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).json({ success: false, error: "Error processing data" });
  }
});
router.get("/:user_id", async function (req, res) {
  try {
    // Lấy user_id từ body của request
    const user_id = req.params.user_id;
    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not found in request body" });
    }

    // Gọi stored procedure GetCustomerCartDetails với tham số user_id
    const data_cart = await new Promise((resolve, reject) => {
      connect.query(
        "CALL GetCustomerCartDetails(?)",
        [user_id],
        function (error, results) {
          if (error) {
            reject(error);
          } else {
            resolve(results[0]); // Giả sử kết quả được trả về là phần tử đầu tiên của mảng kết quả
          }
        }
      );
    });

    res.json({ success: true, data: data_cart });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/:user_id", upload.none(), async function (req, res) {
  try {
    // Lấy user_id, brand, và name từ body của request
    const { idProduct } = req.body;
    console.log(idProduct);
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "Missing user ID, brand, or name in request body",
      });
    }

    // Gọi stored procedure AddProductToCart với các tham số từ client
    connect.query(
      "CALL AddProductToCart( ?, ?)",
      [user_id, idProduct],
      function (error, results) {
        if (error) {
          // Xử lý lỗi khi gọi stored procedure
          console.error("Error:", error);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        } else {
          // Lấy giá trị success_flag từ kết quả trả về
          const success_flag = results[0][0].success;

          // Kiểm tra giá trị success_flag để xác định kết quả thành công hay không
          if (success_flag === 1) {
            // Nếu thành công, trả về phản hồi thành công
            return res.json({
              success: true,
              message: "Product added to cart successfully",
            });
          } else {
            // Nếu không thành công, trả về phản hồi thất bại
            return res.status(400).json({
              success: false,
              message: "Failed to add product to cart",
            });
          }
        }
      }
    );
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
module.exports = router;
