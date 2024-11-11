const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const token = req.cookies.token || req.cookies.adminToken || tokenFromHeader || req.headers.token;

    console.log('Token:', token); // Log token để kiểm tra

    if (!token) {
        console.log('No token provided');
        return res.redirect('/'); // Không có token
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err);
            return res.redirect('/'); // Token không hợp lệ
        }

        req.user = user;
        next();
    });
};


module.exports = authenticateToken;