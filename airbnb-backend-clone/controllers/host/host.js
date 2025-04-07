const fs = require('fs');


const House = require("../../models/house");
const User = require("../../models/user");

// house registration get request

exports.getHouseRegistration = (req, res, next) => {
  const editing = req.query.editing === "true";
  res.render("./host/HouseRegister-edit",{
    editing: editing,
    title: "Register House",
    currentPage: "/host/house-registration",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user
  });
};

// house registration post request


exports.postHouseRegistration = async (req, res, next) => {
  const { houseName, houseLocation, housePrice, houseDescription, houseRating} = req.body;

  if(!req.file) {
    res.status(422).send('image is not valid');
  }
  const housePic = req.file.path;

 const house = new House( {houseName, houseLocation, houseDescription, housePrice, houseRating, housePic});

  await house.save().then(() => {
    console.log('house added succesfully')
  });

  const houseId = house._id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  const houseFound = await House.findById(houseId)
  houseFound.hostUserId.push(userId);
  user.houses.push(houseId);
  await houseFound.save();
  await user.save();

  res.render("./host/HouseAdded", {houseName, houseLocation, housePrice, houseRating, housePic,
    title: "House Added" ,
    currentPage: "host/house-registration",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user
  });
};

exports.postEditHouse = (req, res, next) => {
  const { houseId, houseName, houseLocation, houseDescription, housePrice, houseRating} = req.body;

 House.findById(houseId).then((house) => {
  house.houseName = houseName;
  house.houseLocation = houseLocation;
  house.houseDescription = houseDescription;
  house.housePrice = housePrice;
  house.houseRating = houseRating;

  if(req.file){
    fs.unlink(house.housePic, (err) => {
      console.log('error while deleting images: ', err)
    });
    house.housePic = req.file.path;
  }



  house.save().then((result) => {
  }
).catch(err => {
  console.log('error while saving editng changes', err);
});
  res.redirect('/host/host-house-list');
}).catch(err => {
  console.log('error while finding id',err);
})
}


exports.getHostHouseList = async (req, res, next) => {
const userId = req.session.user._id;
  const user = await User.findById(userId).populate('houses');
  res.render("./host/host-house-list", { registeredHouse: user.houses ,
        title: "Host's House",
        currentPage: "/host-house-list",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
      });
  
};


exports.getEditHouse = (req, res, next) => {
  const houseId = req.params.houseId;
  const editing = req.query.editing === "true";
  House.findById(houseId).then((house) => {
    if (!house) {
      return res.redirect('/host/host-house-list');
    } {
      res.render("./host/HouseRegister-edit",{
        house: house,
        editing: editing,
        title: "Edit House",
        currentPage: "/host-house-list",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
      });
    }
   
  }

)
  }

  exports.postDeleteHouse = async (req, res, next) => {

const houseId = req.params.houseId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if(user.houses.includes(houseId)) {
  user.houses = user.houses.filter(fav => fav != houseId);
  await user.save();
  }
  res.redirect("/host/host-house-list");
}
