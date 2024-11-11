const express = require('express');
const router = express.Router();
const axios = require('axios');
// const cookieParser = require("cookie-parser");
// router.use(cookieParser());
router.post('/address', async function(req, res) {
    const {
        id_ad,
        firstName,
        phoneNumber,
        selectedCity,
        selectedDistrict,
        address,
    } = req.body;
    const token = req.cookies.token;
    console.log(req.body);
    const user = req.session.user ? req.session.user.id_kh : null;
    try {
        await axios.post(
            `${process.env.DOMAIN}:${process.env.PORT}/api_order/${user}`, {
                id_ad: id_ad,
                firstName: firstName,
                phoneNumber: phoneNumber,
                selectedCity: selectedCity,
                selectedDistrict: selectedDistrict,
                address: address,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}` // Gửi token qua header Authorization
                }
            }
        );
        return res.send(firstName);
    } catch (error) {
        console.error('Đã xảy ra lỗi khi gửi dữ liệu tới /api_cart:', error);
    }
});
router.get('/', async function(req, res) {
    const user = req.session.user ? req.session.user : null;
    const token = req.cookies.token;
    console.log('user:', user);
    if (user == null) {
        // Xử lý khi không có user trong session
        return res.redirect('/');
    } else {
        const cart = await axios.get(
            `${process.env.DOMAIN}:${process.env.PORT}/${process.env.API_ORDER}/${user.id_kh}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Gửi token qua header Authorization
                }
            }
        );
        const cartorder = cart.data.data;
        return res.render('order', { cartorder, user });
    }
});
module.exports = router;