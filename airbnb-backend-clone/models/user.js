const mongoose  = require('mongoose');


const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
  
    lastName: String,
  
    email: {
      type: String,
      required: true,
      unique: true
    },

 password: {
      type: String,
      required: true
    },
  
    userType: {
      type: String,
      required: true,
      enum: ['guest', 'host']
    },

    favourites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'House',
    }],

    houses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'House',
    }]


  
})


module.exports = mongoose.model('User', UserSchema);


