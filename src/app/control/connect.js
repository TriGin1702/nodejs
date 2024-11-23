const mysql = require("mysql2");
// import mysql from 'mysql2/promise';
// let connect = mysql.createPool({
//     host: "mysql-db",
//     port: "3306",
//     user: "root",
//     password: "gin@17022001",
//     database: "web",
//     waitForConnections: true,
//     connectionLimit: 10, // Số lượng kết nối tối đa trong pool
//     queueLimit: 0
// });
// const connect = mysql.createConnection({
//     host: "localhost", // Tên của service trong Docker Compose
//     port: "3309", // Port mặc định của MySQL
//     user: "root",
//     password: "gin@17022001",S
//     database: "web",
// });
let connect = mysql.createPool({
  host: "localhost",
  port: "5000",
  user: "root",
  password: "gin@17022001",
  database: "web2",
  waitForConnections: true,
  connectionLimit: 10, // Số lượng kết nối tối đa trong pool
  queueLimit: 0,
});
// connect.connect((err) => {
//     if (err) {
//         console.error("Error connecting to database:", err);
//         return;
//     }
//     console.log("Connected to database");
// });
connect.on("error", (err) => {
  console.error("Database pool error:", err);
  // Nếu có lỗi kết nối, bạn có thể xử lý ở đây, ví dụ:
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    // Tạo lại kết nối
    connect.end(); // Đóng pool hiện tại
    const newPool = mysql.createPool({
      host: "localhost",
      user: "root",
      database: "web2",
      waitForConnections: true,
      connectionLimit: 10, // Số lượng kết nối tối đa trong pool
      queueLimit: 0,
    });
    // Gán lại pool mới vào biến pool
    connect = newPool;
  } else {
    throw err; // Hoặc xử lý lỗi khác theo nhu cầu của bạn
  }
});
// connect.on("error", (err) => {
//   console.error("Database pool error:", err);
//   // Nếu có lỗi kết nối, bạn có thể xử lý ở đây, ví dụ:
//   if (err.code === "PROTOCOL_CONNECTION_LOST") {
//     // Tạo lại kết nối
//     connect.end(); // Đóng pool hiện tại
//     const newPool = mysql.createPool({
//       host: "localhost",
//       port: "3309",
//       user: "root",
//       password: "gin@17022001",
//       database: "web",
//       waitForConnections: true,
//       connectionLimit: 10, // Số lượng kết nối tối đa trong pool
//       queueLimit: 0,
//     });
//     // Gán lại pool mới vào biến pool
//     connect = newPool;
//   } else {
//     throw err; // Hoặc xử lý lỗi khác theo nhu cầu của bạn
//   }
// });
module.exports = connect;
