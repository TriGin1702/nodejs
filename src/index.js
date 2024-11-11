const path = require('path');
const morgan = require('morgan');
const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

require('dotenv').config();
const route = require('./route/index');
const port = process.env.PORT || 80; // Sử dụng cổng 80

// Middleware
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Template engine
app.engine(
    '.hbs',
    handlebars.engine({
        extname: '.hbs',
    })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, './resource/views'));

// Start server
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
// Socket.io configuration
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });
    // Xử lý các sự kiện khác tại đây
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
route(app);
global.io = io;