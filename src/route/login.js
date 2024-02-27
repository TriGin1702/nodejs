const express = require("express");
const router1 = express.Router();
const axios = require("axios");
const multer = require("multer"); // Import multer

const upload = multer(); // Khởi tạo multer

router1.get("/", async (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.error(err);
    res.send("error");
  }
});

router1.post("/", upload.none(), async (req, res) => {
  // Sử dụng upload.none() để xử lý form không có files
  try {
    const apiResponse = await axios.get("http://localhost:3000/api_acc");
    const accounts = apiResponse.data;

    const accountName = req.body.accountName;
    const password = req.body.password;

    console.log(accountName, password);

    const matchedAccount = accounts.find(
      (account) =>
        account.account == accountName && account.password == password
    );

    if (matchedAccount) {
      res.send("Login successful");
    } else {
      res.send("Incorrect account or password");
    }
  } catch (err) {
    console.error(err);
    res.send("Error");
  }
});

module.exports = router1;
