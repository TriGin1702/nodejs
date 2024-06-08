const express = require('express');
const connect = require('../../app/control/connect');
const router = express.Router();

router.get('/:user_id', async function (req, res) {
  try {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: 'User ID not found in request body' });
    }

    const data_cart = await new Promise((resolve, reject) => {
      connect.query(
        'CALL GetBillDetailsByUserId(?)',
        [user_id],
        function (error, results) {
          if (error) {
            reject(error);
          } else {
            resolve(results[0]);
          }
        }
      );
    });

    res.json({ success: true, data: data_cart });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.post('/:user_id', async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const {
      id_ad,
      firstName,
      phoneNumber,
      selectedCity,
      selectedDistrict,
      address,
    } = req.body;
    console.log(user_id);

    await new Promise((resolve, reject) => {
      connect.query(
        'CALL UpdateAddressAndUserAddressWithDate(?,?,?,?,?,?,?)',
        [
          user_id,
          id_ad,
          firstName,
          phoneNumber,
          selectedCity,
          selectedDistrict,
          address,
        ],
        function (error, results) {
          if (error) {
            console.error('Error:', error);
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    res.status(200).json({ success: true, message: 'Update successful' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
