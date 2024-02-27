const express = require("express");
const connect = require("../../app/control/connect");
const router2 = express.Router();

router2.get("/", async (req, res) => {
  try {
    const brand = await new Promise((resolve, reject) => {
      connect.query("SELECT * FROM product", (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    res.json(brand); // Chuyển dữ liệu brand sang dạng JSON và gửi về client
  } catch (err) {
    console.error(err);
    res.send("error"); // Xử lý lỗi nếu truy vấn không thành công
  }
});

router2.delete("/:brands/:name", async (req, res) => {
  try {
    const { brands, name } = req.params;

    // Thực hiện xóa sản phẩm từ cơ sở dữ liệu
    await new Promise((resolve, reject) => {
      connect.query(
        "DELETE FROM product WHERE brands = ? AND name = ?",
        [brands, name],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    res.send("Product deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product");
  }
});

module.exports = router2;
