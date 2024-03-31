const express = require("express");
const connect = require("../../app/control/connect");
const router2 = express.Router();

router2.get("/", async (req, res) => {
  try {
    const { accountName, password } = req.query;
    const acc = await new Promise((resolve, reject) => {
      connect.query(
        `SELECT * FROM customer where account = ? and password = ? `,
        [accountName, password],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });

    if (acc && acc.length > 0) {
      res.json(acc[0]); // Chuyển dữ liệu sang dạng JSON và gửi về client
    } else {
      res.send("Account not found");
    }
  } catch (err) {
    console.error(err);
    res.send("error"); // Xử lý lỗi nếu truy vấn không thành công
  }
});

router2.post("/", async (req, res) => {
  try {
    const { accountName, password } = req.body;
    const acc = await new Promise((resolve, reject) => {
      connect.query(
        `SELECT * FROM customer where account = ? and password = ? `,
        [accountName, password],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });

    if (acc && acc.length > 0) {
      res.json(acc[0]); // Chuyển dữ liệu sang dạng JSON và gửi về client
    } else {
      res.send("Account not found");
    }
  } catch (err) {
    console.error(err);
    res.send("error"); // Xử lý lỗi nếu truy vấn không thành công
  }
});
router2.post("/register", async (req, res) => {
  try {
    const { name, gender, age, accountName, password } = req.body;
    connect.query(
      `INSERT INTO customer (name, gender, age, account, password) VALUES (?, ?, ?, ?, ?)`,
      [name, gender, age, accountName, password],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error"); // Xử lý lỗi nếu truy vấn không thành công
        } else {
          res.status(200).send("Registration successful!"); // Phản hồi về cho người dùng
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Error"); // Xử lý lỗi nếu truy vấn không thành công
  }
});
module.exports = router2;
