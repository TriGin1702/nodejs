const express = require("express");
const connect = require("../../app/control/connect");
const router2 = express.Router();

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
      checkquery = `SELECT * FROM product where brands = '${searchValue}' or name = '${searchValue}' ${sortQuery}`;
    } else {
      checkquery = `SELECT * FROM product ${sortQuery}`; // Tạo câu truy vấn SQL hoàn chỉnh
    }
    const query = checkquery;
    const brand = await new Promise((resolve, reject) => {
      connect.query(query, (err, rows) => {
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

router2.delete("/:id", async (req, res) => {
  try {
    const id_product = req.params.id;
    console.log(id_product);
    // Thực hiện xóa sản phẩm từ cơ sở dữ liệu
    await new Promise((resolve, reject) => {
      connect.query(
        "DELETE FROM product WHERE id_product = ?",
        [id_product],
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
