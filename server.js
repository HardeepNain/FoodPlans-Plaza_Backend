// npm init -y
// npm i express
const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieParser = require('cookie-parser');
const userRouter = require('./Router/userRouter');
const authRouter = require('./Router/authRouter');
const planRouter = require('./Router/planRouter');
const reviewRouter = require('./Router/reviewRouter');
const bookingRouter = require('./Router/bookingRouter');

// server init
const app = express();

app.use(express.static("Frontend_folder"));
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use("/api/plan", planRouter);
app.use('/api/auth', authRouter);
app.use('/api/review', reviewRouter);
app.use('/api/booking', bookingRouter);

app.listen(process.env.PORT||8081, function () {
    console.log("server started");
})

// 404 page
app.use(function (req, res) {
    res.status(404).json({
        message: "page Not found"
    })
})