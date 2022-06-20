const jwt = require('jsonwebtoken');

// const { JWT_SECRET } = require("../secrets");
let JWT_SECRET;
if (process.env.JWT_SECRET) {
    JWT_SECRET = process.env.JWT_SECRET;
} else {
    JWT_SECRET = require("../secrets").JWT_SECRET;
}

const userModel = require('../model/userModel');

module.exports.protectRoute =
    function protectRoute(req, res, next) {
        try {
            // console.log("protect route");

            let decryptedToken = jwt.verify(req.cookies.JWT, JWT_SECRET);
            console.log("68", decryptedToken)
            if (decryptedToken) {
                let userId = decryptedToken.id;
                req.userId = userId
                next();
            } else {
                res.send("kindly login to access this resource ");
            }
        } catch (err) {

            res.status(200).json({
                message: err.message
            })
        }
    }

module.exports.bodyChecker =
    function bodyChecker(req, res, next) {
        // console.log("body checker");

        let isPresent = Object.keys(req.body).length;
        console.log("ispresent", isPresent)
        if (isPresent) {
            next();
        } else {
            res.send("kind send details in body ");
        }
    }

module.exports.isAuthorized = function (roles) {
    console.log("I will run when the server is started");

    // function call 
    console.log()
    return async function (req, res,next) {
        console.log("Inner function");
        let { userId } = req;
        try {
            let user = await userModel.findById(userId);
            let userisAuthorized = roles.includes(user.role);
            if (userisAuthorized) {
                req.user = user;
                next();
            } else {
                res.status(200).json({
                    message: "user not authorized"
                })
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Server error"
            });
        }
    }

}