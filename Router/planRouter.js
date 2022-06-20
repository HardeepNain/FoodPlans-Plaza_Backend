// requirements
const express = require('express');
let planRouter = express.Router();
let planModel = require("../model/planModel")
const { protectRoute, bodyChecker, isAuthorized } = require("./utilFns");
const { createElement,
    getElement, getElements,
    updateElement,
    deleteElement } = require("../helpers/factory");

// functions
const createPlan = createElement(planModel);
const deletePlan = deleteElement(planModel);
const updatePlan = updateElement(planModel);
const getPlan = getElement(planModel);
const getPlans = getElements(planModel);

planRouter.use(protectRoute);

// routes
planRouter
    .route('/')
    .post(bodyChecker, isAuthorized(["admin"]), createPlan)
    .get(protectRoute, isAuthorized(["admin", "ce"]), getPlans);

planRouter.route("/sortByRating", getbestPlans);
planRouter.route("/:id")
    .get(getPlan)
    .patch(bodyChecker, isAuthorized(["admin", "ce"]), updatePlan)
    .delete(bodyChecker, isAuthorized(["admin"]), deletePlan)

async function getbestPlans(req, res) {
    // console.log("getBestPlans");
    try{  
    let plans = await PlanModel.find()
    .sort("-averageRating").populate({
            path: 'reviews',
            select: "review"
        })
    console.log(plans);
    res.status(200).json({
        plans
    })
} catch (err) {
    console.log(err);
    res.status(200).json({
        message: err.message
    })
}

}

module.exports = planRouter;