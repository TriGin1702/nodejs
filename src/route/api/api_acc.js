const express = require("express");
const connect = require("../../app/control/connect");
const router2 = express.Router();

router2.get("/list_users", async (req, res) => {
  try {
    const users = await new Promise((resolve, reject) => {
      connect.query(`SELECT * FROM customer`, (err, rows) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

router2.post("/register", async (req, res) => {
  try {
    const { name, gender, age, accountName, password } = req.body;

    const existingUser = await new Promise((resolve, reject) => {
      connect.query(
        `SELECT * FROM customer WHERE account = ?`,
        [accountName, password],
        (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    if (existingUser.length > 0) {
      return res.status(400).send("Account already exists.");
    } else {
      connect.query(
        `INSERT INTO customer (name, gender, age, account, password) VALUES (?, ?, ?, ?, ?)`,
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
      res.json(acc[0]);
    } else {
      res.send("Account not found");
    }
  } catch (err) {
    console.error(err);
    res.send("error");
  }
});

module.exports = router2;
