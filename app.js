const express = require("express");
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({path: './.env'});

const app = express();

const db = require('./db/db.js');

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: false}));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

const http = require("http");
const server = http.createServer(app).listen(5001, () => {
    console.log("Server started on Port 5001");
})

const io = require('socket.io')(server);
