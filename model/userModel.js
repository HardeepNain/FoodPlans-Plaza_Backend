const mongoose = require("mongoose");

// let { PASSWORD } = require("../secrets");
let PASSWORD;
if (process.env.PASSWORD) {
    PASSWORD = process.env.PASSWORD;
} else {
    PASSWORD = require("../secrets").PASSWORD;
}
const validator = require("email-validator");
// const bcrypt = require("bcrypt");

// console.log("userModel Password:" + PASSWORD);
// console.log("userModel process: " + process.env.PASSWORD);
// console.log("userModel require: " + require("../secrets"));

let dbLink = `mongodb+srv://firstproject:${PASSWORD}@cluster0.gdeii.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(dbLink)
    .then(function (connection) {
        console.log("connected to db")
    }).catch(function (error) {
        console.log("err", error);
    })

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: function () {
                // third party library 
                return validator.validate(this.email)
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        }
        ,
        confirmPassword: {
            type: String,
            required: true,
            minlength: 8,
            validate: function () {
                return this.password == this.confirmPassword
            }
        },
        createdAt: {
            type: String,

        },
        token: String,
        validUpto: Date,
        role: {
            type: String,
            enum: ["admin", "ce", "user"],
            default: "user"
        },
        bookings: {
            //   array of object id 
            type: [mongoose.Schema.ObjectId],
            ref: "bookingModel"
        },
    })
    
// hook
userSchema.pre('save', function (next) {
    // do stuff
    // const salt = await bcrypt.genSalt(10);
    // password convert text
    // this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;
    next();
});
// document method
userSchema.methods.resetHandler = function (password, confirmPassword) {
    // const salt = await bcrypt.genSalt(10);
    // password convert text
    // this.password = await bcrypt.hash(this.password, salt);

    this.password = password;
    this.confirmPassword = confirmPassword;
    this.token = undefined;
}
// model
let userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;