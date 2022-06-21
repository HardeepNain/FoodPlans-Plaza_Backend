const mongoose = require("mongoose");

// const { PASSWORD } = require("../secrets");
let PASSWORD;
if (process.env.PASSWORD) {
    PASSWORD = process.env.PASSWORD;
} else {
    PASSWORD = require("../secrets").PASSWORD;
}
// console.log("bookingModel:" + PASSWORD);

let dbLink = `mongodb+srv://firstproject:${PASSWORD}@cluster0.gdeii.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(function (db) {
    // console.log(db);
    console.log("connected to db")
}).catch(function (err) {
    console.log("err", err);
})
const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    bookedAt: {
        type: Date
    },
    priceAtThatTime: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "failed", "sucess"],
        required: true,
        default: "pending"
    }
})
const bookingModel = mongoose.model("bookingModel", bookingSchema);
module.exports = bookingModel;