const { error } = require('console');
const fs = require('fs');
const mysql = require('mysql');
const connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'course',
});


module.exports = connect;