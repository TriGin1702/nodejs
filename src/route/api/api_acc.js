const express = require("express");
const connect = require("../../app/control/connect");
const router2 = express.Router();

router2.get("/", async (req, res) => {
  try {
    const acc = await new Promise((resolve, reject) => {
      connect.query("SELECT * FROM customer", (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    res.json(acc); // Chuyển dữ liệu brand sang dạng JSON và gửi về client
  } catch (err) {
    console.error(err);
    res.send("error"); // Xử lý lỗi nếu truy vấn không thành công
  }
});

module.exports = router2;
