const express = require('express');
const router = express.Router();
const connect = require('../../app/control/connect');
const authenticateToken = require("./authenticateToken");
router.post('/:user_id', authenticateToken, async(req, res) => {
    const { name, phoneNumber, city, district, address, checkedProducts } =
    req.body;

    try {
        const user_id = req.params.user_id;
        if (!user_id) {
            return res
                .status(400)
                .json({ success: false, message: 'User ID not found in request body' });
        }

        for (const product of checkedProducts) {
            const { productName, productBrand } = product;

            await new Promise((resolve, reject) => {
                connect.query(
                    'CALL InsertOrUpdateAddressAndSetBillStatus(?, ?, ?, ?, ?, ?, ?, ?)', [
                        user_id,
                        productBrand,
                        productName,
                        city,
                        district,
                        address,
                        name,
                        phoneNumber,
                    ],
                    (error, results) => {
                        if (error) {
                            console.error('Error processing data:', error);
                            reject(error);
                        } else {
                            resolve(results);
                        }
                    }
                );
            });
        }

        res
            .status(200)
            .json({ success: true, message: 'Data processed successfully' });
    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({ success: false, error: 'Error processing data' });
    } finally {
        // await connect.end();
    }
});

module.exports = router;