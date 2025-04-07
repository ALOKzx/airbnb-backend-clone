// core module

// external module
const express = require("express");

// local module
const hostControllers = require("../controllers/host/host");

const hostRouter = express.Router();

hostRouter.get("/house-registration", hostControllers.getHouseRegistration);
hostRouter.post("/house-registration", hostControllers.postHouseRegistration);

hostRouter.get("/host-house-list", hostControllers.getHostHouseList);
hostRouter.get("/edit-house/:houseId", hostControllers.getEditHouse);
hostRouter.post('/edit-house/', hostControllers.postEditHouse);
hostRouter.post('/delete-house/:houseId', hostControllers.postDeleteHouse);

exports.hostRouter = hostRouter;
