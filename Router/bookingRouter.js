// dependency & router
const express = require("express");
const bookingRouter = express.Router();
const bookingModel = require("../model/bookingModel");
const UserModel = require("../model/userModel");
const { protectRoute } = require("./utilFns")
const {
    getElement, getElements,
    updateElement,
} = require("../helpers/factory");

// functions
const updatebooking = updateElement(bookingModel);
const getbooking = getElement(bookingModel);
const getbookings = getElements(bookingModel);

// razorpay
const Razorpay = require("razorpay");

// let { KEY_ID, KEY_SECRET } = require("../secrets");
let KEY_ID;
if (process.env.KEY_ID) {
    KEY_ID = process.env.KEY_ID;
} else {
    KEY_ID = require("../secrets").KEY_ID;
}
let KEY_SECRET;
if (process.env.KEY_SECRET) {
    KEY_SECRET = process.env.KEY_SECRET;
} else {
    KEY_SECRET = require("../secrets").KEY_SECRET;
}

var razorpay = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
});

async function verifyPayment(req, res) {

    const secret = KEY_SECRET; 
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    console.log(digest, req.headers["x-razorpay-signature"]);

    if (digest === req.headers["x-razorpay-signature"]) {
        console.log("request is legit");
        res.status(200).json({
            message: "OK",
        });
    } else {
        res.status(403).json({ message: "Invalid" });
    }
};

// createbooking
const initiateBooking = async function (req, res) {
    try {
        let booking = await bookingModel.create(req.body);
        let bookingId = booking["_id"];
        let userId = req.body.user;
        let user = await userModel.findById(userId);
        user.bookings.push(bookingId);
        await user.save();
        const payment_capture = 1;
        const amount = 500;
        const currency = "INR";
        const options = {
            amount,
            currency,
            receipt: `rs_${bookingId}`,
            payment_capture,
        };
        const response = await razorpay.orders.create(options);
        console.log(response);
        res.status(200).json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
            booking: booking,
            message: "booking created",
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

// deletebooking
const deletebooking = async function (req, res) {
    try {
        let booking = await bookingModel.findByIdAndDelete(req.body.id);
        console.log("booking", booking);
        let userId = booking.user;
        let user = await userModel.findById(userId);
        let idxOfbooking = user.bookings.indexOf(booking["_id"]);
        user.booking.splice(idxOfbooking, 1);
        await user.save();
        res.status(200).json({
            message: "booking deleted",
            booking: booking
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
};

// routes
bookingRouter.route("/verification").post(verifyPayment)
bookingRouter
    .route("/:id")
    .get(getbooking)
    .patch(protectRoute, updatebooking)
    .delete(protectRoute, deletebooking)

bookingRouter
    .route("/")
    .get(getbookings) 
    .post(protectRoute, initiateBooking);

module.exports = bookingRouter;


