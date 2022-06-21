const mongoose = require("mongoose");

// const { PASSWORD } = require("../secrets");
let PASSWORD;
if (process.env.PASSWORD) {
    PASSWORD = process.env.PASSWORD;
} else {
    PASSWORD = require("../secrets").PASSWORD;
}
// console.log("reviewModel:"+PASSWORD);

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
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review can't be empty"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Review must contain some rating"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Review must belong to a user"],
        ref:"userModel"
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Review must belong to a plan "],
        ref:"planModel"
    }
})
const ReviewModel = mongoose.model("reviewModel", reviewSchema);
module.exports = ReviewModel;