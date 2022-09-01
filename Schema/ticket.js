const mongoose = require("mongoose");

const ticketschema = mongoose.Schema({
    movieimg:
    {
        type: String,
        required: true
    },
    movieName:
    {
        type: String,
        required: true
    },
    theater:
    {
        type: String,
        required: true
    },
    movieTime:
    {
        type: String,
        required: true
    },
    moviePrice:
    {
        type: Number,
        required: true
    },
    movieLanguage:
    {
        type: String,
        required: true
    },
    movieWatch:
    {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

const Booking = mongoose.model("Booking", ticketschema);

module.exports = Booking;

