const express = require("express");
const route = express.Router();
const Booking = require("../Schema/ticket");
const authFile = require("../Mongo/authentication");
const User = require("../Schema/user");
route.post("/moviecreate" , authFile.authenticationChecker, async (req,res) =>
{
    const ticketData = {
        movieName : req.body.movieName,
        theater : req.body.theater,
        movieTime : req.body.movieTime,
        moviePrice : req.body.moviePrice
    }

    await Booking.create(ticketData);

    return res.send("Ticket Successfully Created");
})

route.get("/moviedelete/:movieid", authFile.authenticationChecker, async (req,res) =>
{
    const id  = req.params.movieid;

    await Booking.findByIdAndDelete(id);

    return res.send("Movie Successfully Delete");
})

route.get("/getMovies", authFile.authenticationChecker ,async (req,res) =>
{
    const movies  =  await Booking.find({});

    return res.send(movies);
})


route.post("/moviebooking/:movieid" , authFile.authenticationChecker,async (req,res) =>
{
    const userid = req.body.id;
    const movieid = req.params.movieid;

    const user = await User.findByIdAndUpdate(userid,{
        moviebooking : movieid
    },
    {
        new : true,
        runValidators :true,
    })

    return res.send(user);
})


module.exports = route;

