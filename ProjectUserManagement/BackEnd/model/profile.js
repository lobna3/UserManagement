const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Profile = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Ensure this matches the model name exactly
      required: true
    },
    tel: String,
    city: String,
    country: String,
    postalcode: String,
    bio: String,
    address: String,
    imageUrl:String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', Profile);

