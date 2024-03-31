// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const upload = multer();
// const connect = require("../../app/control/connect");
// router.post("/:user_id", async (req, res) => {
//   const { name, phoneNumber, city, district, address, checkedProducts } =
//     req.body;

//   try {
//     const user_id = req.params.user_id;
//     if (!user_id) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User ID not found in request body" });
//     }
//     // Thực hiện lặp qua từng sản phẩm trong mảng checkedProducts để gọi store procedure
//     for (const product of checkedProducts) {
//       const { productName, productBrand } = product;

//       // Thực thi store procedure InsertOrUpdateAddressAndSetBillStatus
//       await connect.query(
//         "CALL InsertOrUpdateAddressAndSetBillStatus(?, ?, ?, ?, ?, ?, ?, ?)",
//         [
//           user_id,
//           productBrand,
//           productName,
//           city,
//           district,
//           address,
//           name,
//           phoneNumber,
//         ]
//       );
//     }
//     res
//       .status(200)
//       .json({ success: true, message: "Data processed successfully" });
//   } catch (error) {
//     console.error("Error processing data:", error);
//     // Xử lý lỗi khi thực thi store procedure hoặc các lỗi khác
//     res.status(500).json({ success: false, error: "Error processing data" });
//   }
// });
