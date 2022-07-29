const mongoose = require("mongoose");
const dbconnect = async () =>
{
    try{
        await mongoose.connect("mongodb+srv://prathammehra:7ju4yNykmchBifif@cluster0.rpzdfzl.mongodb.net/booking?retryWrites=true&w=majority",{
            useNewUrlParser: true, 
            useUnifiedTopology: true
        })
        console.log("MongoDB connect");
    }
    catch(error)
    {
        console.log(`Connection Fail error is ${error}`);
    }
}


module.exports = dbconnect;