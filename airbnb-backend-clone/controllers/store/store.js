
const House = require("../../models/house");
const User = require("../../models/user");

// home
exports.getIndex = (req, res, next) => {

  House.find().then((registeredHouse) => {
    res.render("./store/index", {
      registeredHouse: registeredHouse,
      title: "AirBnB",
      currentPage: "/",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
      
    });
  });
};

exports.getHouses = (req, res, next) => {
  House.find().then((registeredHouse) => {
    res.render("./store/house-list", {
      registeredHouse: registeredHouse,
      title: "Houses",
      currentPage: "/houses",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  });
};

exports.getFavouriteLists = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
      res.render("./store/favourite-list", {
        favouriteHouse : user.favourites,
        title: "Favourites",
        currentPage: "/favourite-list",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
      });
      
};

exports.postFavouriteLists = async (req, res, next) => {
  const houseId = req.body.houseId;
  const UserId = req.session.user._id;
  const user = await User.findById(UserId);
  if(!user.favourites.includes(houseId)) {
    user.favourites.push(houseId)
    await user.save()
    return res.redirect("/favourite-list");
  }
  console.log('House already marked as favourite')
   return  res.redirect("/favourite-list");
    
};

exports.getBookings = (req, res, next) => {
  res.render("./store/bookings", {
    title: "Bookings",
    currentPage: "/bookings",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user
  });
};
exports.getReserve = (req, res, next) => {
  res.render("./store/reserve", {
    title: "AirBnB",
    currentPage: "/reserve",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user
  });
};

exports.getHouseDetails = async (req, res, next) => {
  const houseId = req.params.houseId;
  const houseFound = await House.findById(houseId);
   
    if (!houseFound) {
      console.log("House not found");
      res.redirect("/houses");
    } else {
      const userId = houseFound.hostUserId;
      const userHost = await User.findById(userId);
      res.render("./store/house-details", {
        house:houseFound,userHost,
        title: "House Details",
        currentPage: "/houses",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
      });
    }
};

exports.postRemoveFavourites = async (req, res, next) => {
  const houseId = req.params.houseId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if(user.favourites.includes(houseId)) {
  user.favourites = user.favourites.filter(fav => fav != houseId);
  await user.save();
  }
  res.redirect("/favourite-list");

};
