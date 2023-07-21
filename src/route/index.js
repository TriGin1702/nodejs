const news = require('./sitevip');
const create = require('./create');
const homepage = require('./home');
const connection = require('../app/control/connect');
const time = Date.now();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/public/image');
    },
    filename: (req, file, cb) => {
        cb(null, time + '-' + file.originalname);
    },
});
const upload = multer({ storage });

connection.connect((err) => {
    if (err) throw err;
    console.log('connected');
})

function route(app) {
    app.use('/news', news);
    app.use('/create', create);
    app.use('/', homepage);
    app.post('/home', upload.single('image'), (req, res) => {
        const sql = 'INSERT INTO product (brands, name, description, type, gia, image) VALUES (?, ?, ?, ?, ?, ?)';
        const { brand, name, description, type, gia } = req.body;
        let dongbo;
        if (req.file) {
            dongbo = time + '-' + req.file.originalname;
        } else {
            dongbo = null;
        }
        connection.query(sql, [brand, name, description, type, gia, dongbo], (err, result) => {
            if (err) {
                console.error('Error saving product:', err);
            } else {
                console.log('Product saved:', result);
            }
        });
        res.send(req.body);
    });
    app.get('/:id', async(req, res) => {
        try {
            const inputString = req.params.id;
            const splittedStrings = inputString.split('-');

            // Lấy hai chuỗi đã tách ra
            const firstPart = splittedStrings[0]; // "anpha"
            const secondPart = splittedStrings[1];
            await connection.query("select * from product where brands=? and name=?", [firstPart, secondPart], (err, result) => {
                const product = result;
                res.render('product', { product: product[0] });
            })
        } catch (err) {
            res.send(err);
        }
    });
}
module.exports = route;