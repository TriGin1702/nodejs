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
    const query = `SELECT SUM(quantity) AS totalQuantity FROM bill WHERE id_kh = ?`;

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
    const sortValue = req.query.sort; // Lấy giá trị của tham số "sort" từ query string
    const searchValue = req.query.search;
    // Xử lý giá trị của tham số "sort" để tạo câu truy vấn sắp xếp phù hợp
    if (sortValue == "top") {
      sortQuery = "ORDER BY gia DESC"; // Sắp xếp từ cao đến thấp dựa trên trường "price"
    } else if (sortValue == "down") {
      sortQuery = "ORDER BY gia ASC"; // Sắp xếp từ thấp đến cao dựa trên trường "price"
    }
    let checkquery = "";
    if (searchValue) {
      checkquery = `SELECT * FROM product JOIN brand p ON product.id_brand = p.id_brand where (p.name = ? or product.name = ?) and is_hidden = 0 ${sortQuery}`;
    } else {
      checkquery = `SELECT product.*, p.name AS brand_name 
                FROM product 
                JOIN brand p ON product.id_brand = p.id_brand
                WHERE product.is_hidden = 0 
                ${sortQuery}`; // Tạo câu truy vấn SQL hoàn chỉnh
    }
    const query = checkquery;
    const product = await new Promise((resolve, reject) => {
      connect.query(query, [searchValue, searchValue], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    return res.json(product); // Chuyển dữ liệu brand sang dạng JSON và gửi về client
  } catch (err) {
    console.error(err);
    return res.send("error"); // Xử lý lỗi nếu truy vấn không thành công
  }
});
router2.delete("/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.admin == "system") {
      const id_product = req.params.id;
      console.log(id_product);
      // Thực hiện xóa sản phẩm từ cơ sở dữ liệu
      await new Promise((resolve, reject) => {
        connect.query("UPDATE product SET is_hidden = true; where id_product = ?", [id_product], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });

      res.send("Product deleted successfully");
    }
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
