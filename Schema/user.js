const mongoose = require("mongoose");
const userschema = new mongoose.Schema({
    name :
    {
        type : String,
        required: true

    },
    useremail :
    {
        type : String,
        required: true

    },
    password : 
    {
        type : String,
        required: true
    },
    confirmpassword : 
    {
        type : String,
        required : true
    },
    moviebooking : 
        [{
            // type : mongoose.Schema.Types.ObjectId,
            type: String,
        }],
},
    
{
    timestamps : true
});

const User = mongoose.model("User",userschema);
module.exports = User;