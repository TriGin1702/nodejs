const express = require("express");
const router = express.Router();
const axios = require("axios");
// const cookieParser = require("cookie-parser");
// router.use(cookieParser());
router.post("/address", async function (req, res) {
  const { user_address, name, phone, ipdistrict, address, id_bill } = req.body;
  console.log(req.body);
  const user = req.session.user ? req.session.user : null;
  const token = req.cookies.token;

  if (user == null) {
    // Xử lý khi không có user trong session
    return res.redirect("/");
  }
  try {
    const response = await axios.post(
      `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_ORDER}/${user.id_user}`,
      {
        user_address: user_address,
        firstName: name,
        phoneNumber: phone,
        selectedDistrict: ipdistrict,
        address: address,
        id_bill: id_bill,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 9000, // Thêm timeout
      }
    );
    console.log("Kết quả từ API:", response.data);
    return res.redirect("/order");
  } catch (error) {
    console.error("Đã xảy ra lỗi khi gửi dữ liệu tới /api_cart:", error);
  }
});
router.delete("/delete", async (req, res) => {
  const { id_bill } = req.body; // Lấy id_bill từ body request
  const user = req.session.user ? req.session.user : null;
  const token = req.cookies.token;

  if (!user) {
    // Kiểm tra nếu không có user trong session
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    // Gửi yêu cầu tới API để xác nhận xóa
    const response = await axios.post(
      `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_ORDER}/delete/${user.id_user}`,
      { id_bill: id_bill },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Kiểm tra phản hồi từ API bên ngoài
    if (response.data.success) {
      return res.status(200).json({ success: true, message: "Bill deleted successfully" });
    } else {
      return res.status(400).json({ success: false, message: response.data.message || "Error occurred while deleting bill" });
    }
  } catch (error) {
    console.error("Error when sending delete request:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/", async function (req, res) {
  const user = req.session.user ? req.session.user : null;
  const token = req.cookies.token;

  if (user == null) {
    // Xử lý khi không có user trong session
    return res.redirect("/");
  } else {
    try {
      const cartResponse = await axios.get(`${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_ORDER}/${user.id_user}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
        },
      });
      console.log(`${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_ORDER}/${user.id_user}`);

      if (cartResponse) {
        let cartorder = cartResponse.data.data || [];
        let user_address = cartResponse.data.user_address || [];
        let citys = cartResponse.data.citys || [];

        // Gắn isFirstOccurrence cho từng dòng
        cartorder = cartorder.map((item, index, array) => {
          item.isFirstOccurrence = index === 0 || item.id_bill !== array[index - 1].id_bill;
          return item;
        });

        // Tách ra hai danh sách dựa vào status
        const pendingOrders = cartorder.filter((item) => item.status === "Pending");
        const confirmedOrders = cartorder.filter((item) => item.status === "Confirm");
        const hasOrders = pendingOrders.length > 0 || confirmedOrders.length > 0;

        // Render với hai danh sách
        return res.render("order", { pendingOrders, confirmedOrders, hasOrders, user_address, citys });
      } else {
        return res.render("order", { pendingOrders: [], confirmedOrders: [], hasOrders: false, user_address: [], citys: [] });
      }
    } catch (error) {
      console.error("Error fetching cart orders:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
});

module.exports = router;
