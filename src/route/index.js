const news = require("./news");
const homepage = require("./home");
const api = require("./api/api");
const api_cart = require("./api/api_cart");
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
  app.use("/api_cart", api_cart);
  // app.use("/api_address", api_address);
  // app.use("/news", news);
  app.use("/homepage", homepage);
  app.use("/", login);
}
module.exports = route;
