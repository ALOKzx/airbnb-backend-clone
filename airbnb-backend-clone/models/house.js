const mongoose  = require('mongoose');

const houseSchema = mongoose.Schema(
  {
    houseName: {
      type: String,
      required: true
    },
  
    houseLocation: {
      type: String,
      required: true
    },

    houseDescription: String,
  
    housePrice: {
      type: Number,
      required: true
    },
 houseRating: {
      type: Number,
      required: true
    },
  
  
    housePic: String,

    hostUserId: [{
      type : mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
   
  
})

// houseSchema.pre('findOneAndDelete', async function(next) {
// const houseId = this.getQuery()['_id'];
// await Favourites.deleteMany({houseId:houseId});
// next();
// })

module.exports = mongoose.model('House', houseSchema);


