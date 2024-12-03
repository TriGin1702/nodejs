const express = require("express");
const connect = require("../../app/control/connect");
const router = express.Router();
const authenticateToken = require("./authenticateToken");
router.get("/:user_id", authenticateToken, async function (req, res) {
  try {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({ success: false, message: "User ID is required in the URL" });
    }

    const data_cart = await new Promise((resolve, reject) => {
      connect.query("CALL GetBillDetailsByUser(?)", [user_id], function (error, results) {
        if (error) {
          console.error("Error executing query:", error); // In ra lỗi chi tiết để dễ gỡ lỗi
          reject({ success: false, message: "Error fetching data from database", error: error });
        } else {
          resolve(results[0] || []); // Trả về mảng rỗng nếu không có dữ liệu
        }
      });
    });
    if (data_cart.length === 0) {
      return res.json({ success: true, data: [], user_address: [], citys: [] });
    }
    // Truy vấn địa chỉ chi tiết
    const user_address = await new Promise((resolve, reject) => {
      connect.query(
        `SELECT 
            ua.id_useraddress,
           ua.id_user,
           a.id_address,
           a.name AS name,
           a.phone AS phone,
           a.ip_address,
           a.id_district as id_district,
           d.name AS district_name,
           c.id_city as id_city,
           c.name AS city_name
         FROM user_address ua
         JOIN address a ON ua.id_address = a.id_address
         JOIN district d ON a.id_district = d.id_district
         JOIN city c ON d.id_city = c.id_city
         WHERE ua.id_user = ?;`,
        [user_id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
    const citys = await new Promise((resolve, reject) => {
      connect.query("SELECT * FROM city", (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    res.json({ success: true, data: data_cart, user_address: user_address, citys: citys });
  } catch (err) {
    console.error("Error processing request:", err); // In ra lỗi chi tiết của toàn bộ request
    res.status(500).json({ success: false, message: "Internal Server Error", error: err });
  }
});
router.post("/:user_id", authenticateToken, async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { user_address, firstName, phoneNumber, selectedDistrict, address, id_bill } = req.body;

    console.log("Starting address update...");
    const result_address = await new Promise((resolve, reject) => {
      connect.query(
        "CALL AddOrUpdateUserAddress(?,?,?,?,?,?)",
        [user_address, user_id, firstName, phoneNumber, address, selectedDistrict],
        function (error, results) {
          if (error) {
            console.error("Error in AddOrUpdateUserAddress:", error);
            reject(error);
          } else {
            console.log("Address update result:", results);
            resolve(results);
          }
        }
      );
    });

    const update = result_address[0][0].success;
    await new Promise((resolve, reject) => {
      connect.query("UPDATE bill_address SET id_useraddress = ? WHERE id_bill = ?", [update, id_bill], (error, results) => {
        if (error) {
          console.error("Error:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json({ success: true, message: "Update successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
router.post("/delete/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { id_bill } = req.body;

    // Thực thi thủ tục DeleteBillData
    await new Promise((resolve, reject) => {
      connect.query("CALL DeleteBillData(?,?)", [user_id, id_bill], (error, results) => {
        if (error) {
          console.error("Error:", error);
          reject(error); // Reject promise nếu có lỗi
        } else {
          resolve(results); // Resolve promise nếu thủ tục thực thi thành công
        }
      });
    });

    // Nếu thủ tục xóa thành công, trả về success
    res.json({ success: true, message: "Bill deleted successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
