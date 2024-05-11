const express = require("express");
const connect = require("../../app/control/connect");
const router2 = express.Router();
router2.get("/list_users", async (req, res) => {
  try {
    connect.query(`SELECT * FROM customer`, (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send("error"); // Gửi lỗi về client nếu có lỗi xảy ra trong truy vấn
      }
      res.json(rows); // Gửi dữ liệu về client dưới dạng JSON khi truy vấn thành công
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("error"); // Xử lý lỗi nếu có lỗi xảy ra trong try-catch
  }
});
router2.post("/register", async (req, res) => {
  try {
    const { name, gender, age, accountName, password } = req.body;

    // Kiểm tra xem accountName hoặc password đã được sử dụng chưa
    connect.query(
      `SELECT * FROM customer WHERE account = ?`,
      [accountName, password],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error"); // Xử lý lỗi nếu truy vấn không thành công
          return;
        }

        // Nếu tồn tại người dùng đã sử dụng accountName hoặc password tương tự
        if (result.length > 0) {
          return res.status(400).send("Account already exists."); // Phản hồi với thông báo lỗi cho người dùng
        } else {
          // Nếu không có người dùng nào sử dụng accountName hoặc password tương tự, thêm người dùng mới vào cơ sở dữ liệu
          connect.query(
            `INSERT INTO customer (name, gender, age, account, password) VALUES (?, ?, ?, ?, ?)`,
            [name, gender, age, accountName, password],
            (err, result) => {
              if (err) {
                console.error(err);
                return res.status(500).send("Error"); // Xử lý lỗi nếu truy vấn không thành công
              } else {
                return res.status(200).send("Registration successful!"); // Phản hồi về cho người dùng
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error"); // Xử lý lỗi nếu có lỗi xảy ra
  }
});
// router2.get("/", async (req, res) => {
//   try {
//     const acc = await new Promise((resolve, reject) => {
//       connect.query(
//         `SELECT * FROM customer where account = ? and password = ? `,
//         [req.app.locals.accountName, req.app.locals.password],
//         (err, rows) => {
//           if (err) reject(err);
//           resolve(rows);
//         }
//       );
//     });
//     delete req.app.locals.accountName;
//     delete req.app.locals.password;
//     if (acc && acc.length > 0) {
//       return res.json(acc[0]); // Chuyển dữ liệu sang dạng JSON và gửi về client
//     } else {
//       return res.send("Account not found");
//     }
//   } catch (err) {
//     console.error(err);
//     return res.send("error"); // Xử lý lỗi nếu truy vấn không thành công
//   }
// });

router2.post("/", async (req, res) => {
  try {
    const { accountName, password } = req.body;
    req.app.locals.accountName = accountName;
    req.app.locals.password = password;
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
      return res.json(acc[0]); // Chuyển dữ liệu sang dạng JSON và gửi về client
    } else {
      return res.send("Account not found");
    }
  } catch (err) {
    console.error(err);
    return res.send("error"); // Xử lý lỗi nếu truy vấn không thành công
  }
});
module.exports = router2;
