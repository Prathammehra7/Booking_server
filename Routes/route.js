const express = require("express");
const route = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../Schema/user");
const authFile = require("../Mongo/authentication");



route.get("/welcome", (req, res) => {
    return res.send("Welcome to PVR Theater")
});

route.post("/Signup", async (req, res) => {
    try {
        var salt = bcrypt.genSaltSync(10);
        console.log(req.body.password , req.body.confirmpassword);
        var hash = bcrypt.hashSync(req.body.password, salt);
        var hash2 = bcrypt.hashSync(req.body.confirmpassword, salt);
        const letters = /^[a-zA-z]*$/;
    
        const userData = {
            name : req.body.name,
            useremail : req.body.useremail,
            password : hash,
            confirmpassword : hash2
        }
    
        if(userData.password !== userData.confirmpassword)
        {
            console.log("Confirm Password and Password is Mismatch");
            return res.status(500).send("Confirm Password and Password is Mismatch");
        }
        else if(!userData.name)
        {
            console.log("Pleace enter the name");
            return res.status(500).send("Pleace enter the name");
        }   
        else if(!userData.name.match(letters))
        {
            console.log("Username Must Contain only alphabets");
            return res.status(500).send("Username Must Contain only alphabets");
        }
    
        await User.create(userData);
    
        console.log("SignUp Complete");
        return res.send("SignUp Complete");
        } catch (error) {
            console.log(error);
        }
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
    const id = req.params.usersid;

    if (!id) {
        return res.send("keep eneter the Id")
    }
    const userId = await User.findByIdAndDelete(id);

    if (!userId) {
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
        { token: token }
    );
})




module.exports = route;

