const news = require("./news");
const homepage = require("./home");
const api = require("./api/api");
const api_acc = require("./api/api_acc");
const login = require("./login");
const { exec } = require("child_process");
const connection = require("../app/control/connect");
const time = Date.now();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/public/image");
    },
    filename: (req, file, cb) => {
        cb(null, time + "-" + file.originalname);
    },
});
const upload = multer({ storage });

connection.connect((err) => {
    if (err) throw err;
    console.log("connected");
});

function route(app) {
    exec(
        "npx node-sass src/resource/scss/app.scss --output src/public/css/app.css",
        (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(stdout);
        }
    );
    app.use("/api", api);
    app.use("/api_acc", api_acc);
    app.use("/login", login);
    app.use("/news", news);
    app.get("/cart", (err, res) => {
        res.render("cart");
    });
    // app.use("/create", create);
    app.use("/", homepage);
    app.post("/home", upload.single("image"), (req, res) => {
        const sql =
            "INSERT INTO product (brands, name, description, type, gia, image) VALUES (?, ?, ?, ?, ?, ?)";
        const { brand, name, description, type, gia } = req.body;
        let dongbo;
        if (req.file) {
            dongbo = time + "-" + req.file.originalname;
        } else {
            dongbo = "anhthu.png";
        }
        connection.query(
            sql, [brand, name, description, type, gia, dongbo],
            (err, result) => {
                if (err) {
                    console.error("Error saving product:", err);
                } else {
                    console.log("Product saved:", result);
                }
            }
        );
        res.send(req.body);
    });
}
module.exports = route;