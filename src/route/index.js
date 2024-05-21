const news = require("./news");
const api = require("./api/api");
const api_cart = require("./api/api_cart");
const api_acc = require("./api/api_acc");
const api_order = require("./api/api_order");
const login = require("./login");
const register = require("./register");
const homepage = require("./home");
const create = require("./create");
const cart = require("./cart");
const order = require("./order");
require("dotenv").config();
// const { exec } = require("child_process");

function route(app) {
  // exec(
  //   "npx node-sass src/resource/scss/app.scss --output src/public/css/app.css",
  //   (err, stdout, stderr) => {
  //     if (err) {
  //       console.error(err);
  //       return;
  //     }
  //     console.log(stdout);
  //   }
  // );
  app.use(`/${process.env.API_PRODUCT}`, api);
  app.use(`/${process.env.API_ACC}`, api_acc);
  app.use(`/${process.env.API_CART}`, api_cart);
  app.use(`/${process.env.API_ORDER}`, api_order);
  app.use("/homepage/create", create);
  app.use("/homepage", homepage);
  app.use("/cart", cart);
  app.use("/news", news);
  app.use("/register", register);
  app.use("/order", order);
  app.use("/", login);
}
module.exports = route;
