const path = require('path');
const morgan = require('morgan');
var handlebars = require('express-handlebars');
//Fire the 'scream' event:
const express = require('express');
const app = express();
const route = require('./route/index');
require('dotenv').config();

const port = process.env.PORT || 3001;
//HTTP logger
app.use(express.static(path.join(__dirname, 'public')));
console.log('__dirname: ', path.join(__dirname, './public'));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(morgan('combined'));
//Template engine
app.set('port', port);
app.engine(
  '.hbs',
  handlebars.engine({
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, './resource/views'));
console.log('__dirname: ', path.join(__dirname, '/resource/views'));
route(app);
app.listen(port, () => console.log(`listening on port  + ${port}`));
