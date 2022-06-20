// dependency
const express = require("express");
const userModel =
    require("../model/userModel")
// router
const userRouter = express.Router();
const { protectRoute, bodyChecker, isAuthorized } = require("./utilFns");
const { createElement,
    getElement, getElements,
    updateElement,
    deleteElement } = require("../helpers/factory");

//functions
const createUser = createElement(userModel);
const deleteUser = deleteElement(userModel)
const updateUser = updateElement(userModel)
const getUser = getElement(userModel)
const getUsers = getElements(userModel)

userRouter.use(protectRoute);

// routes
userRouter
    .route('/')
    .post(bodyChecker, isAuthorized(["admin"]), createUser)
    .get(protectRoute, isAuthorized(["admin", "ce"]), getUsers);

userRouter.route("/:id")
    .get(getUser)
    .patch(bodyChecker, isAuthorized(["admin", "ce"]),updateUser)
    .delete(bodyChecker, isAuthorized(["admin"]), deleteUser)

module.exports = userRouter;

