const express = require("express");
const connect = require("../../app/control/connect");
const router2 = express.Router();
// const authenticateToken = require("./authenticateToken");
// router2.get("/list_users", authenticateToken, async(req, res) => {
//     try {
//         if (req.user.admin) {
//             const users = await new Promise((resolve, reject) => {
//                 connect.query(`SELECT * FROM customer`, (err, rows) => {
//                     if (err) {
//                         console.error(err);
//                         reject(err);
//                     } else {
//                         resolve(rows);
//                     }
//                 });
//             });
//             res.json(users);
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("error");
//     }
// });

router2.post("/register", async (req, res) => {
  try {
    const { name, gender, age, accountName, password } = req.body;

    const existingUser = await new Promise((resolve, reject) => {
      connect.query(`SELECT * FROM user WHERE account = ?`, [accountName, password], (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (existingUser.length > 0) {
      return res.status(400).send("Account already exists.");
    } else {
      connect.query(
        `INSERT INTO user (name, gender, age, account, password) VALUES (?, ?, ?, ?, ?)`,
        [name, gender, age, accountName, password],
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error");
          } else {
            res.status(200).send("Registration successful!");
          }
        }
      );
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  } finally {
    // await connect.end();
  }
});

router2.post("/", async (req, res) => {
  try {
    const { accountName, password } = req.body;
    const acc = await new Promise((resolve, reject) => {
      // Sử dụng CALL để gọi thủ tục
      connect.query(`CALL GetUserInformation(?, ?)`, [accountName, password], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    // Kiểm tra kết quả trả về từ thủ tục
    if (acc && acc[0].length > 0) {
      // rows sẽ là một mảng chứa các mảng con, do đó cần truy cập rows[0]
      res.json(acc[0][0]); // Giả sử bạn muốn trả về thông tin người dùng đầu tiên
    } else {
      res.send("Account not found");
    }
  } catch (err) {
    console.error(err);
    res.send("error");
  } finally {
    // await connect.end(); // Bạn có thể bỏ comment nếu cần đóng kết nối
  }
});

module.exports = router2;
