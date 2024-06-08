const mysql = require("mysql2");
// const connect = mysql.createConnection({
//     host: "mysql-db",
//     port: "3306",
//     user: "root",
//     password: "gin@17022001",
//     database: "web",
// });
// const connect = mysql.createConnection({
//     host: "localhost", // Tên của service trong Docker Compose
//     port: "3309", // Port mặc định của MySQL
//     user: "root",
//     password: "gin@17022001",
//     database: "web",
// });
const connect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "web",
});
connect.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to database");
});
module.exports = connect;