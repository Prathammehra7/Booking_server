const express = require("express");
const route = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../Schema/user");
const authFile = require("../Mongo/authentication");



route.get("/welcome", (req, res) => {
    return res.send("Welcome to PVR Theater")
});

route.post("/Signup", async (req, res) => {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    var hash2 = bcrypt.hashSync(req.body.confirmpassword, salt);
    const letters = /^[a-zA-z]*$/;

    const userData = {
        name: req.body.name,
        useremail: req.body.useremail,
        password: hash,
        confirmpassword: hash2
    }

    if (userData.password !== userData.confirmpassword) {
        return res.status(500).send("Password doesn't match");
    }
    else if(!userData.name)
    {
        return res.status(500).send("Pleace enter the name");
    }   
    else if(!userData.name.match(letters))
    {
        return res.status(500).send("Username Must Contain only alphabets");
    }
    await User.create(userData);

    return res.send("SignUp Complete");
})

route.post("/resetpassword", async (req, res) => {
    const id = req.body.id;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    var hash2 = bcrypt.hashSync(req.body.confirmpassword, salt);

    const passwordChange = {
        password: hash,
        confirmpassword: hash2
    }

    if (passwordChange.password !== passwordChange.confirmpassword) {
        return res.status(500).send("Password doesn't match");
    }

    await User.findByIdAndUpdate(id, passwordChange,
        {
            new: true,
            runValidators: true
        })

    return res.send("Password change Successfully");
})

route.get("/userdata", authFile.authenticationChecker, async (req, res) => {
    const data = await User.find({});

    return res.send(data);
})

route.delete("/deleteaccount/:usersid", async (req, res) => {
    const id  = req.params.usersid;

    if(!id)
    {
        return res.send("keep eneter the Id")
    }
    const userId = await User.findByIdAndDelete(id);

    if(!userId)
    {
        return res.status(500).send("User not exist");
    }
    return res.send("Account Successfully delete");
})

route.post("/Login", async (req, res) => {
    const user = await User.findOne({ useremail: req.body.useremail })

    if (!user) {
        console.log("User not found check Email");
        return res.status(500).send("User not found Check Email");
    }

    const check = bcrypt.compareSync(req.body.password, user.password); // true

    if (!check) {
        console.log("Password is Wrong");
        return res.status(500).send("Password is Wrong");
    }

    const token = authFile.gentoken(user._id);
    console.log("login successfully");
    return res.send(
        {token : token}
        );
})

route.post("/Moviebook/:movieid", authFile.authenticationChecker, async(req,res) => {

    try {
        const userid = req.body.id;
        const movieid = req.params.movieid;
        console.log(userid,movieid);
        const updatedUser = await User.findByIdAndUpdate(userid,{
    
            $push : {moviebooked : movieid}
        },
        {
            new : true,
            runValidators : true,
        });
        return res.send(updatedUser);        
    } catch (error) {
        console.log(error);
    }
});




module.exports = route;

