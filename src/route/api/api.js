const express = require("express");
const connect = require("../../app/control/connect");
const router2 = express.Router();
const fs = require("fs");
const path = require("path");
const authenticateToken = require("./authenticateToken");
const js = path.join(__dirname, "../../public/js/");
router2.get("/quantity_product/:user_id", authenticateToken, async (req, res) => {
  const userId = req.params.user_id;
  try {
    const query = `SELECT SUM(quantity) AS totalQuantity FROM cart WHERE id_user = ?`;

    const result = await new Promise((resolve, reject) => {
      connect.query(query, [userId], (err, result) => {
        if (err) {
          console.error("Error while getting total quantity:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const totalQuantity = result[0].totalQuantity || 0;
    res.status(200).json({ totalQuantity });
  } catch (error) {
    console.error("Error while getting total quantity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router2.get("/", async (req, res) => {
  try {
    let sortQuery = "";
    const sortValue = req.query.sort; // Lấy giá trị của tham số "sort"
    const searchValue = req.query.search;

    // Xử lý giá trị của tham số "sort"
    if (sortValue == "top") {
      sortQuery = "ORDER BY price DESC"; // Sắp xếp từ cao đến thấp
    } else if (sortValue == "down") {
      sortQuery = "ORDER BY price ASC"; // Sắp xếp từ thấp đến cao
    }

    let checkquery = "";
    let queryParams = []; // Mảng chứa các tham số cho câu truy vấn

    if (searchValue) {
      // Thêm ký tự % vào searchValue để tìm kiếm giống như LIKE
      checkquery = `
        SELECT product.*, p.name AS brand_name, pt.name as type
        FROM product 
        JOIN brand p ON product.id_brand = p.id_brand
        JOIN product_type pt ON product.id_type = pt.id_type
        WHERE (p.name LIKE ? OR product.name LIKE ? OR pt.name LIKE ?) AND product.is_hidden = 0 
        ${sortQuery}`;

      // Thêm các tham số vào mảng queryParams, bao gồm dấu % cho tìm kiếm LIKE
      queryParams = [`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`];
    } else {
      checkquery = `
        SELECT product.*, p.name AS brand_name, pt.name as type
        FROM product 
        JOIN brand p ON product.id_brand = p.id_brand 
        JOIN product_type pt ON product.id_type = pt.id_type
        WHERE product.is_hidden = 0 
        ${sortQuery}`;
    }

    const query = checkquery;
    const product = await new Promise((resolve, reject) => {
      connect.query(query, queryParams, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    console.log(product);
    return res.json(product); // Trả về kết quả dưới dạng JSON
  } catch (err) {
    console.error(err);
    return res.send("error"); // Xử lý lỗi nếu có
  }
});

router2.delete("/:id", authenticateToken, async (req, res) => {
  try {
    // Dùng req.user để truy cập thông tin user sau khi xác thực
    console.log(req.user);
    const id_product = req.params.id;
    console.log(id_product);
    // Thực hiện xóa sản phẩm từ cơ sở dữ liệu
    // await new Promise((resolve, reject) => {
    //   connect.query("CALL ManageProductVisibility(?)", [id_product], (err, result) => {
    //     if (err) reject(err);
    //     resolve(result);
    //   });
    // });
    await new Promise((resolve, reject) => {
      connect.query("UPDATE product SET is_hidden = true WHERE id_product = ?", [id_product], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    res.send("Product deleted successfully");
    // if (req.user.role === "admin") {
    // } else {
    //   res.status(403).send("Permission denied");
    // }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product");
  }
});

// router2.get("/js", async function(req, res) {
//     try {
//         const jsContent = fs.readFileSync(js + "product_new2.js", "utf8");
//         res.send(jsContent);
//     } catch (error) {
//         console.error("Lỗi khi đọc tệp JavaScript:", error);
//         s
//         res.status(500).send("Đã xảy ra lỗi khi đọc tệp JavaScript.");
//     }
// });
module.exports = router2;
