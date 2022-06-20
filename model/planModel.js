const mongoose = require("mongoose");

// let { PASSWORD } = require("../secrets");
let PASSWORD;
if (process.env.PASSWORD) {
    PASSWORD = process.env.PASSWORD;
} else {
    PASSWORD = require("../secrets").PASSWORD;
}

const validator = require("email-validator");
let dbLink
    = `mongodb+srv://admin:${PASSWORD}@cluster0.3gwfq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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
let planModel = mongoose.model("PABPlanModel", planSchema);
module.exports = planModel;