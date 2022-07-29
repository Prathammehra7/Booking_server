const mongoose = require("mongoose");

const ticketschema = mongoose.Schema({
    movieName:
    {
        type: String,
        require: true
    },
    theater:
    {
        type: String,
        require: true
    },
    movieTime:
    {
        type: String,
        require: true
    },
    moviePrice:
    {
        type: Number,
        require: true
    }
},
    {
        timestamps: true
    });

const ticket = mongoose.model("Booking", ticketschema);

module.exports = ticket;

