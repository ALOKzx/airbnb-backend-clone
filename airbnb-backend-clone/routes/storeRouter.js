// external modules
const express = require("express");

// local modules
const storeRouter = express.Router();
const storeControllers = require("../controllers/store/store");

storeRouter.get("/", storeControllers.getIndex);
storeRouter.get("/houses", storeControllers.getHouses);
storeRouter.get("/favourite-list", storeControllers.getFavouriteLists);
storeRouter.post("/favourites-list", storeControllers.postFavouriteLists);
storeRouter.get("/house-details", storeControllers.getHouseDetails);
storeRouter.get("/bookings", storeControllers.getBookings);
storeRouter.get("/reserve", storeControllers.getReserve);
storeRouter.get("/houses/:houseId", storeControllers.getHouseDetails);
storeRouter.post('/favourites/houses/:houseId', storeControllers.postRemoveFavourites);

module.exports = storeRouter;
