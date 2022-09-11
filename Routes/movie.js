const express = require("express");
const route = express.Router();
const Booking = require("../Schema/ticket");
const authFile = require("../Mongo/authentication");
const User = require("../Schema/user");
route.post("/moviecreate", authFile.authenticationChecker, async (req, res) => {
    const ticketData = {
        movieimg: req.body.movieimg,
        movieName: req.body.movieName,
        theater: req.body.theater,
        movieTime: req.body.movieTime,
        moviePrice: req.body.moviePrice,
        movieLanguage: req.body.movieLanguage,
        movieWatch: req.body.movieWatch

    }

    await Booking.create(ticketData);

    return res.send("Ticket Successfully Created");
})

route.get("/moviedelete/:movieid", authFile.authenticationChecker, async (req, res) => {
    const id = req.params.movieid;

    await Booking.findByIdAndDelete(id);

    return res.send("Movie Successfully Delete");
})

route.get("/getMovies", authFile.authenticationChecker, async (req, res) => {
    const movies = await Booking.find({});

    return res.send(movies);
})

route.get("/findmovies/:movieid", async (req, res) => {

    try {
        if (!Booking) {

            return res.status(500).send("Movie not found");
        }
        else {
            const movieid = req.params.movieid;

            const Movie = await Booking.findById(movieid);

            return res.send(Movie);
        }

    } catch (error) {
        console.log(error);
    }


});
route.get("/moviebooking/:movieid", authFile.authenticationChecker, async (req, res) => {
    const userid = req.body.id;
    const movieid = req.params.movieid;

    const user = await User.findByIdAndUpdate(userid, {
        moviebooking: movieid
    },
        {
            new: true,
            runValidators: true,
        })

    return res.send(user);
})
// route.get("/allmovies",async(req,res)=>
// {
//    try {
//     const data = await params.movieid({});
//     return res.send(data);
//    } catch (error) {
//     console.log(error);
//     return res.send(error);
//    }
// }
// )


module.exports = route;

