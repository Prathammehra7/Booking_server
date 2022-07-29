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


    const userData = {
        name: req.body.name,
        email: req.body.email,
        password: hash,
        confirmpassword: hash2
    }

    if (userData.password !== userData.confirmpassword) {
        return res.status(500).send("Password doesn't match");
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

route.delete("/deleteaccount", async (req, res) => {
    const id = req.body.id;
    await User.findByIdAndDelete(id);

    return res.send("Account Successfully delete");
})

route.post("/Login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return res.status(500).send("User not found Check Email");
    }

    const check = bcrypt.compareSync(req.body.password, user.password); // true

    if (!check) {
        return res.status(500).send("Password is Wrong");
    }

    const token = authFile.gentoken(user._id);

    return res.send(`Login Successfully ${token}`);
})




module.exports = route;