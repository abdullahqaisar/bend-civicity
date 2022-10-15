const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
    Price: {
        type: Number,
        required: true,
    },
    
    Seats: {
        type: Number,
        required: true,
    },
    OfferStatus: {
        type: String,
        default: "Pending",
    },

    OfferedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    Ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
    },
});

const Offer = mongoose.model("Offer", OfferSchema);
module.exports = Offer;

