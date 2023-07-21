const express = require('express');
const router1 = express.Router();
const { exec } = require('child_process');
const connect = require('../app/control/connect');
// Biên dịch Sass khi khởi động ứng dụng
exec('npm run watch', (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(stdout);
});
router1.get('/', async(req, res) => {
    try {
        await connect.query("SELECT * FROM product", (err, rows) => {
            if (err) throw err;
            const product = rows; // Lưu trữ dữ liệu vào một biến
            res.render('news', { product: product }); // Truyền dữ liệu product vào view
        });
    } catch (err) {
        console.error(err);
        res.send('error'); // Xử lý lỗi nếu truy vấn không thành công
    }
});
module.exports = router1;