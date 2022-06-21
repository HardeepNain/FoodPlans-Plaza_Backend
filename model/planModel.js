const mongoose = require("mongoose");

// let { PASSWORD } = require("../secrets");
let PASSWORD;
if (process.env.PASSWORD) {
    PASSWORD = process.env.PASSWORD;
} else {
    PASSWORD = require("../secrets").PASSWORD;
}
// console.log("planModel:"+PASSWORD);

const validator = require("email-validator");

let dbLink = `mongodb+srv://firstproject:${PASSWORD}@cluster0.gdeii.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(dbLink)
    .then(function (connection) {
        console.log("connected to db")

    }).catch(function (error) {
        console.log("err", error);
    })
    
//schema
const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "kindly pass the name"],
        unique: [true, "plan name should be unique"],
        // errors
        maxlength: [40, "Your plan length is more than 40 characters"],
    },
    duration: {
        type: Number,
        required: [true, "You Need to provide duration"]
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        validate: {
            validator: function () {
                return this.discount < this.price;
            },
            message: "Discount must be less than actual price",
        },
    },
    planImages: {
        type: [String]
    },
    reviews: {
        type: [mongoose.Schema.ObjectId],
        ref:"reviewModel"
    },
    averageRating: Number,
})

// model
let planModel = mongoose.model("planModel", planSchema);
module.exports = planModel;