const mongoose = require('mongoose');
const User = require('./user.model');

function removeLinkedDocuments() {
  // car ref will be the removed from person doc
  Event.remove({ _id: { $in: User.driverData.cars } }).exec();
}

const CarSchema = new mongoose.Schema({
  licensePlateNumber: {
    type: String,
  },

  brand: {
    type: String,
  },

  modelYear: {
    type: Number,
  },

  colour: {
    type: String,
  },

  modelName: {
    type: String,
  },

  isCarInRide: {
    type: Boolean,
    default: false,
  },

  rides: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
  },

  images: {
    carImage: {
      type: String,
      data: Buffer,
      contentType: String,
    },
    copyFrontImage: {
      path: String,
      data: Buffer,
      contentType: String,
    },

    copyBackImage: {
      path: String,
      data: Buffer,
      contentType: String,
    },
  },
});

CarSchema.post('remove', removeLinkedDocuments);

const Car = mongoose.model('Car', CarSchema);
module.exports = Car;
